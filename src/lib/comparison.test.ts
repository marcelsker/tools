import { describe, expect, it, vi } from 'vitest'
import { drawComparison, type TextOptions } from './comparison'

function mockCtx() {
  const ctx = {
    canvas: { width: 0, height: 0 },
    clearRect: vi.fn(),
    drawImage: vi.fn(),
    fillRect: vi.fn(),
    fillStyle: '',
    font: '',
    textBaseline: '',
    fillText: vi.fn(),
    measureText: vi.fn(() => ({ width: 50 })),
  } as unknown as CanvasRenderingContext2D
  return ctx
}

function mockImage(w: number, h: number) {
  return { naturalWidth: w, naturalHeight: h } as HTMLImageElement
}

describe('drawComparison', () => {
  it('sets canvas dimensions to min of both images', () => {
    const ctx = mockCtx()
    drawComparison(ctx, mockImage(800, 600), mockImage(640, 480), 50)
    expect(ctx.canvas.width).toBe(640)
    expect(ctx.canvas.height).toBe(480)
  })

  it('draws both images at 50% split', () => {
    const ctx = mockCtx()
    drawComparison(ctx, mockImage(800, 600), mockImage(800, 600), 50)
    expect(ctx.drawImage).toHaveBeenCalledTimes(2)
    expect(ctx.drawImage).toHaveBeenCalledWith(
      expect.anything(), 0, 0, 400, 600, 0, 0, 400, 600,
    )
    expect(ctx.drawImage).toHaveBeenCalledWith(
      expect.anything(), 400, 0, 400, 600, 400, 0, 400, 600,
    )
  })

  it('draws only image B at 0% split', () => {
    const ctx = mockCtx()
    drawComparison(ctx, mockImage(800, 600), mockImage(800, 600), 0)
    expect(ctx.drawImage).toHaveBeenCalledTimes(1)
    expect(ctx.drawImage).toHaveBeenCalledWith(
      expect.anything(), 0, 0, 800, 600, 0, 0, 800, 600,
    )
  })

  it('draws only image A at 100% split', () => {
    const ctx = mockCtx()
    drawComparison(ctx, mockImage(800, 600), mockImage(800, 600), 100)
    expect(ctx.drawImage).toHaveBeenCalledTimes(1)
    expect(ctx.drawImage).toHaveBeenCalledWith(
      expect.anything(), 0, 0, 800, 600, 0, 0, 800, 600,
    )
  })

  describe('text rendering', () => {
    const opts: TextOptions = {
      labelA: 'LEFT',
      labelB: 'RIGHT',
      fontSize: 10,
      color: '#ffffff',
      position: 'top-left',
      bold: false,
      background: true,
    }

    it('draws text labels when textOptions provided', () => {
      const ctx = mockCtx()
      drawComparison(ctx, mockImage(800, 600), mockImage(800, 600), 50, opts)
      expect(ctx.fillText).toHaveBeenCalled()
      expect(ctx.fillRect).toHaveBeenCalled()
    })

    it('does not draw text when textOptions omitted', () => {
      const ctx = mockCtx()
      drawComparison(ctx, mockImage(800, 600), mockImage(800, 600), 50)
      expect(ctx.fillText).not.toHaveBeenCalled()
      expect(ctx.fillRect).not.toHaveBeenCalled()
    })

    it.each(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const)(
      'positions labels at %s',
      (pos) => {
        const ctx = mockCtx()
        drawComparison(ctx, mockImage(800, 600), mockImage(800, 600), 50, { ...opts, position: pos })
        expect(ctx.fillText).toHaveBeenCalled()
      },
    )
  })
})
