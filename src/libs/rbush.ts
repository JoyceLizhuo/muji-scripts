/*
 (c) 2013, Vladimir Agafonkin
 RBush, a JavaScript library for high-performance 2D spatial indexing of points and rectangles.
 https://github.com/mourner/rbush
*/

export type CompareMinFunc<T> = (a: T, b: T) => number
export type BBoxType = [number, number, number, number]
export type BBoxArray = Array<BBoxType>
export type TreeArray = Array<Tree>
export type ChildType = BBoxType | Tree

export interface Tree {
  children: Array<ChildType>
  leaf: boolean
  bbox: BBoxType
  height: number
}

export class RBush {
  _maxEntries: number
  _minEntries: number
  data: Tree

  constructor(maxEntries = 9) {
    // max entries in a node is 9 by default; min node fill is 40% for best performance
    this._maxEntries = Math.max(4, maxEntries || 9) // 9
    this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4)) // 4
    this.clear()
  }

  // ok
  clear() {
    this.data = {
      children: [],
      leaf: true,
      bbox: this._empty(),
      height: 1,
    }
    return this
  }

  // ok
  all() {
    return this._all(this.data, [])
  }

  // ok
  search(bbox: BBoxType): BBoxArray {
    let node = this.data
    const result: BBoxArray = []
    if (!this._intersects(bbox, node.bbox)) {
      return result
    }
    const nodesToSearch: TreeArray = []
    let i: number
    let len: number
    let child: ChildType
    let childBBox: BBoxType
    while (node) {
      for (i = 0, len = node.children.length; i < len; i++) {
        child = node.children[i]
        childBBox = node.leaf
          ? this.toBBox(child as BBoxType)
          : (child as Tree).bbox
        if (this._intersects(bbox, childBBox)) {
          if (node.leaf) {
            result.push(child as BBoxType)
          } else if (this._contains(bbox, childBBox)) {
            this._all(child as Tree, result)
          } else {
            nodesToSearch.push(child as Tree)
          }
        }
      }
      node = nodesToSearch.pop() as Tree
    }
    return result
  }

  load(data: BBoxArray) {
    if (!(data && data.length)) {
      return this
    }
    if (data.length < this._minEntries) {
      for (const d of data) {
        this.insert(d)
      }
      return this
    }

    // recursively build the tree with the given data from stratch using OMT algorithm
    let node = this._build(data.slice(), 0)
    if (!this.data.children.length) {
      // save as is if tree is empty
      this.data = node
    } else if (this.data.height === node.height) {
      // split root if trees have the same height
      this._splitRoot(this.data, node)
    } else {
      if (this.data.height < node.height) {
        // swap trees if inserted one is bigger
        const tmpNode = this.data
        this.data = node
        node = tmpNode
      }
      // insert the small tree into the large tree at appropriate level
      this._insert(node, this.data.height - node.height - 1, true)
    }
    return this
  }

  // ok
  toBBox<T>(item: T): T {
    return item
  }

  insert(item?: BBoxType): this {
    if (item) {
      this._insert(item, this.data.height - 1)
    }
    return this
  }

  /**
   * @param item - 必须是 this.data 中的某个 bbox 对象的引用
   */
  remove(item: BBoxType) {
    if (!item) {
      return this
    }
    let node: Tree | null = this.data
    const bbox: BBoxType = this.toBBox(item)
    const path: TreeArray = []
    const indexes: Array<number> = []
    let i: number | null = null
    let parent: Tree | null = null
    let goingUp = false

    // depth-first iterative tree traversal
    while (node || path.length) {
      if (!node) {
        // go up
        node = path.pop() as Tree
        parent = path[path.length - 1]
        i = indexes.pop() as number
        goingUp = true
      }
      if (node.leaf) {
        // check current node
        const index = node.children.indexOf(item)
        if (index !== -1) {
          // item found, remove the item and condense tree upwards
          node.children.splice(index, 1)
          path.push(node)
          this._condense(path)
          return this
        }
      }
      if (!goingUp && !node.leaf && this._intersects(bbox, node.bbox)) {
        // go down
        path.push(node)
        indexes.push(i as number)
        i = 0
        parent = node
        node = node.children[0] as Tree
      } else if (parent) {
        // go right
        ;(i as number)++
        node = parent.children[i as number] as Tree
        goingUp = false
      } else {
        // nothing found
        node = null
      }
    }
    return this
  }

  // go through the path, removing empty nodes and updating bboxes
  _condense(path: TreeArray) {
    for (let i = path.length - 1; i >= 0; i--) {
      if (path[i].children.length === 0) {
        if (i > 0) {
          const parent = path[i - 1].children
          parent.splice(parent.indexOf(path[i]), 1)
        } else {
          // root
          this.clear()
        }
      } else {
        this._calcBBox(path[i])
      }
    }
  }

  // ok
  _all(node: Tree, result: BBoxArray): BBoxArray {
    const nodesToSearch: TreeArray = []
    while (node) {
      if (node.leaf) {
        result.push(...(node.children as BBoxArray))
      } else {
        nodesToSearch.push(...(node.children as TreeArray))
      }
      node = nodesToSearch.pop() as Tree
    }
    return result
  }

  _build(items: BBoxArray, level: number, height?: number): Tree {
    const N = items.length
    let M = this._maxEntries
    let node: Tree
    if (N <= M) {
      node = {
        children: items,
        leaf: true,
        height: 1,
        bbox: this._empty(),
      }
      this._calcBBox(node)
      return node
    }
    // 根节点
    if (!level) {
      // target height of the bulk-loaded tree
      height = Math.ceil(Math.log(N) / Math.log(M))

      // target number of root entries to maximize storage utilization
      M = Math.ceil(N / Math.pow(M, height - 1))
      items.sort(this.compareMinX)
    }

    // TODO eliminate recursion?
    node = {
      children: [],
      height: height as number,
      bbox: this._empty(),
      leaf: false,
    }
    const N1 = Math.ceil(N / M) * Math.ceil(Math.sqrt(M))
    const N2 = Math.ceil(N / M)
    const compare = level % 2 === 1 ? this.compareMinX : this.compareMinY

    // split the items into M mostly square tiles
    for (let i = 0; i < N; i += N1) {
      const slice = items.slice(i, i + N1).sort(compare)
      for (let j = 0, sliceLen = slice.length; j < sliceLen; j += N2) {
        // pack each entry recursively
        const childNode = this._build(
          slice.slice(j, j + N2),
          level + 1,
          (height as number) - 1,
        )
        node.children.push(childNode)
      }
    }
    this._calcBBox(node)
    return node
  }

  // ok
  _intersects(a: BBoxType, b: BBoxType): boolean {
    return b[0] <= a[2] && b[1] <= a[3] && b[2] >= a[0] && b[3] >= a[1]
  }

  // ok
  _contains(a: BBoxType, b: BBoxType): boolean {
    return a[0] <= b[0] && a[1] <= b[1] && b[2] <= a[2] && b[3] <= a[3]
  }

  /**
   * 将 item 插入到 tree 中
   * @param item - 要插入的 bbox 或者 tree
   * @param level - 从哪个层级开始寻找插入点
   * @param [isNode] - item 是否是 tree
   */
  _insert(item: ChildType, level: number, isNode?: boolean) {
    const bbox = isNode ? (item as Tree).bbox : this.toBBox(item as BBoxType)
    const insertPath: TreeArray = []

    // find the best node for accommodating the item, saving all nodes along the path too
    const node: Tree = this._chooseSubtree(bbox, this.data, level, insertPath)
    let splitOccured: boolean

    // put the item into the node
    node.children.push(item)
    node.bbox = this._extend(node.bbox, bbox)

    // split on node overflow; propagate upwards if necessary
    do {
      splitOccured = false
      if (insertPath[level].children.length > this._maxEntries) {
        this._split(insertPath, level)
        splitOccured = true
        level--
      }
    } while (level >= 0 && splitOccured)

    // adjust bboxes along the insertion path
    this._adjustParentBBoxes(bbox, insertPath, level)
  }

  // split overflowed node into two
  _split(insertPath: TreeArray, level: number) {
    const node = insertPath[level]
    const M = node.children.length
    const m = this._minEntries
    this._chooseSplitAxis(node, m, M)
    const newNode: Tree = {
      children: node.children.splice(this._chooseSplitIndex(node, m, M)),
      height: node.height,
      leaf: false,
      bbox: this._empty(),
    }
    if (node.leaf) {
      newNode.leaf = true
    }
    this._calcBBox(node)
    this._calcBBox(newNode)
    if (level) {
      insertPath[level - 1].children.push(newNode)
    } else {
      this._splitRoot(node, newNode)
    }
  }

  // ok
  _splitRoot(node: Tree, newNode: Tree) {
    // split root node
    this.data = {
      children: [],
      height: 0,
      bbox: this._empty(),
      leaf: false,
    }
    this.data.children = [node, newNode]
    this.data.height = node.height + 1
    this._calcBBox(this.data)
  }

  _chooseSplitIndex(node: Tree, m: number, M: number) {
    let i: number
    let bbox1: BBoxType
    let bbox2: BBoxType
    let overlap: number
    let area: number
    let minOverlap: number
    let minArea: number
    let index: number | null = null
    minOverlap = minArea = Infinity
    for (i = m; i <= M - m; i++) {
      bbox1 = this._distBBox(node, 0, i)
      bbox2 = this._distBBox(node, i, M)
      overlap = this._intersectionArea(bbox1, bbox2)
      area = this._area(bbox1) + this._area(bbox2)

      // choose distribution with minimum overlap
      if (overlap < minOverlap) {
        minOverlap = overlap
        index = i
        minArea = area < minArea ? area : minArea
      } else if (overlap === minOverlap) {
        // otherwise choose distribution with minimum area
        if (area < minArea) {
          minArea = area
          index = i
        }
      }
    }
    return index as number
  }

  // ok
  _area(a: BBoxType) {
    return (a[2] - a[0]) * (a[3] - a[1])
  }

  // ok a、b 两个 bbox 相交部分的面积
  _intersectionArea(a: BBoxType, b: BBoxType) {
    const minX = Math.max(a[0], b[0])
    const minY = Math.max(a[1], b[1])
    const maxX = Math.min(a[2], b[2])
    const maxY = Math.min(a[3], b[3])
    return Math.max(0, maxX - minX) * Math.max(0, maxY - minY)
  }

  // sorts node children by the best axis for split
  _chooseSplitAxis(node: Tree, m: number, M: number) {
    const compareMinX = node.leaf ? this.compareMinX : this._compareNodeMinX
    const compareMinY = node.leaf ? this.compareMinY : this._compareNodeMinY
    const xMargin = this._allDistMargin(node, m, M, compareMinX)
    const yMargin = this._allDistMargin(node, m, M, compareMinY)

    // if total distributions margin value is minimal for x, sort by minX,
    // otherwise it's already sorted by minY

    if (xMargin < yMargin) {
      node.children.sort(compareMinX)
    }
  }

  // total margin of all possible split distributions where each node is at least m full
  _allDistMargin(
    node: Tree,
    m: number,
    M: number,
    compare: CompareMinFunc<BBoxType> | CompareMinFunc<Tree>,
  ) {
    node.children.sort(compare)
    let leftBBox = this._distBBox(node, 0, m)
    let rightBBox = this._distBBox(node, M - m, M)
    let margin = this._margin(leftBBox) + this._margin(rightBBox)
    let i: number
    let child: ChildType

    for (i = m; i < M - m; i++) {
      child = node.children[i]
      leftBBox = this._extend(
        leftBBox,
        node.leaf ? this.toBBox(child as BBoxType) : (child as Tree).bbox,
      )
      margin += this._margin(leftBBox)
    }

    for (i = M - m - 1; i >= 0; i--) {
      child = node.children[i]
      rightBBox = this._extend(
        rightBBox,
        node.leaf ? this.toBBox(child as BBoxType) : (child as Tree).bbox,
      )
      margin += this._margin(rightBBox)
    }

    return margin
  }

  // ok
  _margin(a: BBoxType) {
    return a[2] - a[0] + (a[3] - a[1])
  }

  // ok min bounding rectangle of node children from k to p-1
  _distBBox(node: Tree, k: number, p: number) {
    let bbox = this._empty()
    for (let i = k, child: ChildType; i < p; i++) {
      child = node.children[i]
      bbox = this._extend(
        bbox,
        node.leaf ? this.toBBox(child as BBoxType) : (child as Tree).bbox,
      )
    }
    return bbox
  }

  // ok
  compareMinX: CompareMinFunc<BBoxType> = (a, b) => {
    return a[0] - b[0]
  }

  // ok
  compareMinY: CompareMinFunc<BBoxType> = (a: BBoxType, b: BBoxType) => {
    return a[1] - b[1]
  }

  // ok
  _compareNodeMinX: CompareMinFunc<Tree> = (a, b) => {
    return a.bbox[0] - b.bbox[0]
  }

  // ok
  _compareNodeMinY: CompareMinFunc<Tree> = (a, b) => {
    return a.bbox[1] - b.bbox[1]
  }

  // ok calculate node's bbox from bboxes of its children
  _calcBBox(node: Tree) {
    node.bbox = this._empty()
    for (
      let i = 0, len = node.children.length, child: ChildType;
      i < len;
      i++
    ) {
      child = node.children[i]
      node.bbox = this._extend(
        node.bbox,
        node.leaf ? this.toBBox(child as BBoxType) : (child as Tree).bbox,
      )
    }
  }

  /**
   *
   * @param bbox
   * @param node
   * @param level
   * @param {Array}path - 搜索 node 的过程中经过的节点
   * @private
   */
  _chooseSubtree(
    bbox: BBoxType,
    node: Tree,
    level: number,
    path: TreeArray,
  ): Tree {
    while (true) {
      path.push(node)
      if (node.leaf || path.length - 1 === level) {
        break
      }
      let minArea = Infinity
      let minEnlargement = Infinity
      let targetNode: Tree | null = null
      for (const d of node.children) {
        const child = d as Tree
        const area = this._area(child.bbox)
        const enlargement = this._enlargedArea(bbox, child.bbox) - area

        // choose entry with the least area enlargement
        if (enlargement < minEnlargement) {
          minEnlargement = enlargement
          minArea = Math.min(area, minArea)
          targetNode = child
        } else if (enlargement === minEnlargement && area < minArea) {
          // otherwise choose one with the smallest area
          minArea = area
          targetNode = child
        }
      }
      node = targetNode as Tree
    }
    return node
  }

  // ok
  _enlargedArea(a: BBoxType, b: BBoxType) {
    return (
      (Math.max(b[2], a[2]) - Math.min(b[0], a[0])) *
      (Math.max(b[3], a[3]) - Math.min(b[1], a[1]))
    )
  }

  // ok adjust bboxes along the given tree path
  _adjustParentBBoxes(bbox: BBoxType, path: Array<Tree>, level: number) {
    for (let i = level; i >= 0; i--) {
      path[i].bbox = this._extend([...path[i].bbox] as BBoxType, bbox)
    }
  }

  // ok
  _extend(a: BBoxType, b: BBoxType): BBoxType {
    return [
      Math.min(a[0], b[0]),
      Math.min(a[1], b[1]),
      Math.max(a[2], b[2]),
      Math.max(a[3], b[3]),
    ]
  }

  // ok
  _empty(): BBoxType {
    return [Infinity, Infinity, -Infinity, -Infinity]
  }
}
