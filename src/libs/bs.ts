// [1,2,3,4,5,6,7,8,9,10,11,12,13,14]
/**
 * @param arr
 * @param toBeSearched
 * @param lastIndex
 * @returns {number|null} - 找到则返回 index
 */
export function bs(
  arr: Array<number>,
  toBeSearched: number,
  lastIndex = 0,
): number | null {
  if (!arr.length) {
    return null
  }
  const len = arr.length
  const index = Math.floor(len / 2)
  const value = arr[index]
  if (value === toBeSearched) {
    return index + lastIndex
  }
  let sub = []
  if (toBeSearched < value) {
    sub = arr.slice(0, index)
    return bs(sub, toBeSearched, lastIndex)
  } else {
    sub = arr.slice(index + 1)
    return bs(sub, toBeSearched, lastIndex + index + 1)
  }
}
