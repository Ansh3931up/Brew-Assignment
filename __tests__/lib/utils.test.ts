import { describe, it, expect } from '@jest/globals'

describe('Utils', () => {
  describe('Basic utilities', () => {
    it('should perform basic math operations', () => {
      expect(1 + 1).toBe(2)
      expect(2 * 3).toBe(6)
      expect(10 / 2).toBe(5)
    })

    it('should handle string operations', () => {
      const str = 'Hello World'
      expect(str.toLowerCase()).toBe('hello world')
      expect(str.toUpperCase()).toBe('HELLO WORLD')
      expect(str.length).toBe(11)
    })

    it('should handle array operations', () => {
      const arr = [1, 2, 3]
      expect(arr.length).toBe(3)
      expect(arr.includes(2)).toBe(true)
      expect(arr.map(x => x * 2)).toEqual([2, 4, 6])
    })
  })
})

