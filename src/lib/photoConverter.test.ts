import { describe, expect, it, vi } from 'vitest'
import { formatFileSize, nextId, convertImage } from './photoConverter'

describe('formatFileSize', () => {
  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500 B')
  })

  it('formats kilobytes', () => {
    expect(formatFileSize(1500)).toBe('1.5 KB')
  })

  it('formats megabytes', () => {
    expect(formatFileSize(2_500_000)).toBe('2.4 MB')
  })
})

describe('nextId', () => {
  it('returns a string with img_ prefix', () => {
    expect(nextId()).toMatch(/^img_\d+_\d+$/)
  })

  it('increments on each call', () => {
    const a = nextId()
    const b = nextId()
    expect(a).not.toBe(b)
  })
})

describe('convertImage', () => {
  it('converts an image to a blob', async () => {
    const canvasEl = document.createElement('canvas')
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') return canvasEl
      return document.createElement(tag)
    })
    vi.spyOn(canvasEl, 'getContext').mockReturnValue({
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D)
    vi.spyOn(canvasEl, 'toBlob').mockImplementation((cb: (b: Blob) => void) => {
      cb(new Blob([''], { type: 'image/png' }))
    })

    const img = { naturalWidth: 100, naturalHeight: 100 } as HTMLImageElement
    const blob = await convertImage(img, {
      format: 'png',
      quality: 0.92,
      maintainAspectRatio: true,
    })
    expect(blob).toBeInstanceOf(Blob)
  })

  it('resizes when width is specified with aspect ratio', async () => {
    const canvasEl = document.createElement('canvas')
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') return canvasEl
      return document.createElement(tag)
    })
    vi.spyOn(canvasEl, 'getContext').mockReturnValue({
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D)
    vi.spyOn(canvasEl, 'toBlob').mockImplementation((cb: (b: Blob) => void) => {
      cb(new Blob([''], { type: 'image/png' }))
    })

    const img = { naturalWidth: 800, naturalHeight: 600 } as HTMLImageElement
    await convertImage(img, {
      format: 'png',
      quality: 0.92,
      width: 400,
      maintainAspectRatio: true,
    })

    expect(canvasEl.width).toBe(400)
    expect(canvasEl.height).toBe(300)
  })
})
