import { RBush, BBoxArray } from '../src/libs/rbush'

interface DataArgs {
  size: number
  delta?: number
}

const getData = ({ size = 0, delta = 0 }: DataArgs): BBoxArray => {
  return [...Array(size)].map((ai, i) => [
    i + delta,
    size - 1 - i + delta,
    i + 1 + delta,
    size - i + delta,
  ])
}

// describe('RBush', () => {
//   const tree = new RBush();
//   test('data 元素数小于 _minEntries = 4 => insert', () => {
//     const data: BBoxArray = getData({
//       size: 3,
//     });
//     tree.load(data);
//   });
// });

describe('RBush', () => {
  const tree = new RBush()
  test('第 1 次 load，大于 maxEntries => build new tree', () => {
    const data: BBoxArray = getData({ size: 19 })
    tree.load(data)
    // tree.insert([1000, 2000, 3000, 4000]);
  })

  // test('第 2 次 load，data 的高度 === tree 原本的高度 => splitRoot', () => {
  //   const data: BBoxArray = getData({ size: 13, delta: 0.1 });
  //   tree.load(data);
  // });
  //
  // test('第 3 次 load，data 的高度 !== tree 原本的高度 => insert', () => {
  //   const data: BBoxArray = getData({ size: 3 });
  //   tree.load(data);
  // });

  test.todo('remove')
})

const data = [
  [0, 18, 1, 19],
  [1, 17, 2, 18],
  [2, 16, 3, 17],
  [3, 15, 4, 16],
  [4, 14, 5, 15],
  [5, 13, 6, 14],
  [6, 12, 7, 13],
  [7, 11, 8, 12],
  [8, 10, 9, 11],
  [9, 9, 10, 10],
  [10, 8, 11, 9],
  [11, 7, 12, 8],
  [12, 6, 13, 7],
  [13, 5, 14, 6],
  [14, 4, 15, 5],
  [15, 3, 16, 4],
  [16, 2, 17, 3],
  [17, 1, 18, 2],
  [18, 0, 19, 1],
]

const result = {
  children: [
    {
      children: [
        [13, 5, 14, 6],
        [12, 6, 13, 7],
        [11, 7, 12, 8],
        [10, 8, 11, 9],
        [9, 9, 10, 10],
        [8, 10, 9, 11],
        [7, 11, 8, 12],
      ],
      leaf: true,
      height: 1,
      bbox: [7, 5, 14, 12],
    },
    {
      children: [
        [6, 12, 7, 13],
        [5, 13, 6, 14],
        [4, 14, 5, 15],
        [3, 15, 4, 16],
        [2, 16, 3, 17],
        [1, 17, 2, 18],
        [0, 18, 1, 19],
      ],
      leaf: true,
      height: 1,
      bbox: [0, 12, 7, 19],
    },
    {
      children: [
        [18, 0, 19, 1],
        [17, 1, 18, 2],
        [16, 2, 17, 3],
        [15, 3, 16, 4],
        [14, 4, 15, 5],
      ],
      leaf: true,
      height: 1,
      bbox: [14, 0, 19, 5],
    },
  ],
  height: 2,
  bbox: [0, 0, 19, 19],
  leaf: false,
}
