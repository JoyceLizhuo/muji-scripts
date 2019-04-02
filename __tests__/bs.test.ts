import { bs } from '../src/libs/bs'

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]

describe('bs', () => {
  test('bs should ok', () => {
    expect(bs(arr, 0)).toBe(null)
    expect(bs(arr, 1)).toBe(0)
    expect(bs(arr, 2)).toBe(1)
    expect(bs(arr, 3)).toBe(2)
    expect(bs(arr, 4)).toBe(3)
    expect(bs(arr, 5)).toBe(4)
    expect(bs(arr, 6)).toBe(5)
    expect(bs(arr, 7)).toBe(6)
    expect(bs(arr, 8)).toBe(7)
    expect(bs(arr, 9)).toBe(8)
    expect(bs(arr, 10)).toBe(9)
    expect(bs(arr, 11)).toBe(10)
    expect(bs(arr, 12)).toBe(11)
    expect(bs(arr, 13)).toBe(12)
    expect(bs(arr, 14)).toBe(13)
    expect(bs(arr, 15)).toBe(14)
    expect(bs(arr, 16)).toBe(15)
    expect(bs(arr, 17)).toBe(16)
    expect(bs(arr, 18)).toBe(null)
    expect(bs(arr, NaN)).toBe(null)
  })
})
