import { describe, expect, it } from 'vitest'
import { tools } from './tools'

describe('tools registry', () => {
  it('exports a non-empty array', () => {
    expect(tools.length).toBeGreaterThan(0)
  })

  it('each tool has required fields', () => {
    for (const tool of tools) {
      expect(tool).toHaveProperty('id')
      expect(typeof tool.id).toBe('string')
      expect(tool.id.length).toBeGreaterThan(0)

      expect(tool).toHaveProperty('name')
      expect(typeof tool.name).toBe('string')
      expect(tool.name.length).toBeGreaterThan(0)

      expect(tool).toHaveProperty('description')
      expect(typeof tool.description).toBe('string')
      expect(tool.description.length).toBeGreaterThan(0)

      expect(tool).toHaveProperty('path')
      expect(typeof tool.path).toBe('string')
      expect(tool.path).toMatch(/^\//)
    }
  })
})
