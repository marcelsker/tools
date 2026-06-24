export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    img.src = url
  })
}

export interface TextOptions {
  labelA: string
  labelB: string
  fontSize: number
  color: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  bold: boolean
  background: boolean
}

export function drawComparison(
  ctx: CanvasRenderingContext2D,
  imgA: HTMLImageElement,
  imgB: HTMLImageElement,
  splitPercent: number,
  textOptions?: TextOptions,
) {
  const width = Math.min(imgA.naturalWidth, imgB.naturalWidth)
  const height = Math.min(imgA.naturalHeight, imgB.naturalHeight)
  const splitPx = Math.round((width * splitPercent) / 100)
  const outW = width
  const outH = height

  const canvas = ctx.canvas
  canvas.width = outW
  canvas.height = outH
  ctx.clearRect(0, 0, outW, outH)

  const leftOutW = Math.round((outW * splitPercent) / 100)
  const rightOutW = outW - leftOutW

  if (leftOutW > 0 && splitPx > 0) {
    ctx.drawImage(imgA, 0, 0, splitPx, height, 0, 0, leftOutW, outH)
  }

  if (rightOutW > 0 && splitPx < width) {
    ctx.drawImage(
      imgB,
      splitPx,
      0,
      width - splitPx,
      height,
      leftOutW,
      0,
      rightOutW,
      outH,
    )
  }

  if (textOptions) {
    const fontSize = Math.max(16, Math.round(outH * (textOptions.fontSize / 100)))
    const fontWeight = textOptions.bold ? 'bold ' : ''
    ctx.font = `${fontWeight}${fontSize}px sans-serif`
    ctx.textBaseline = 'top'
    const padding = Math.round(fontSize * 0.4)

    const drawLabel = (text: string, x: number, y: number) => {
      const metrics = ctx.measureText(text)
      const bgW = metrics.width + padding * 2
      const bgH = fontSize + padding * 2
      if (textOptions.background) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'
        ctx.fillRect(x, y, bgW, bgH)
      }
      ctx.fillStyle = textOptions.color
      ctx.fillText(text, x + padding, y + padding)
    }

    const positions = {
      'top-left': (bw: number) => ({ x: padding, y: padding }),
      'top-right': (bw: number) => ({ x: (leftOutW > 0 ? leftOutW : outW) - bw - padding, y: padding }),
      'bottom-left': (bw: number) => ({ x: padding, y: outH - fontSize - padding * 3 }),
      'bottom-right': (bw: number) => ({ x: (leftOutW > 0 ? leftOutW : outW) - bw - padding, y: outH - fontSize - padding * 3 }),
    }

    if (leftOutW > 0) {
      const metricsA = ctx.measureText(textOptions.labelA)
      const bgWA = metricsA.width + padding * 2
      const posA = positions[textOptions.position](bgWA)
      const xA = textOptions.position.includes('right') ? posA.x : padding
      drawLabel(textOptions.labelA, xA, posA.y)
    }

    if (rightOutW > 0) {
      const metricsB = ctx.measureText(textOptions.labelB)
      const bgWB = metricsB.width + padding * 2
      const offsetX = leftOutW
      let xB: number
      if (textOptions.position.includes('right')) {
        xB = offsetX + rightOutW - bgWB - padding
      } else {
        xB = offsetX + padding
      }
      const yB = textOptions.position.includes('bottom')
        ? outH - fontSize - padding * 3
        : padding
      drawLabel(textOptions.labelB, xB, yB)
    }
  }
}
