import JSZip from 'jszip'

export interface ConvertOptions {
  format: 'png' | 'webp' | 'jpeg' | 'bmp'
  quality: number
  width?: number
  height?: number
  maintainAspectRatio: boolean
}

export interface ImageEntry {
  id: string
  file: File
  img: HTMLImageElement
  thumbnailUrl: string
}

export interface ConvertedEntry {
  id: string
  name: string
  blob: Blob
  url: string
}

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

export function createThumbnail(file: File, maxDim = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      let w = img.naturalWidth
      let h = img.naturalHeight
      if (w > h) {
        if (w > maxDim) { h = Math.round(h * maxDim / w); w = maxDim }
      } else {
        if (h > maxDim) { w = Math.round(w * maxDim / h); h = maxDim }
      }
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('Could not get canvas context')); return }
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL())
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    img.src = url
  })
}

export function convertImage(
  img: HTMLImageElement,
  options: ConvertOptions,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    let w = img.naturalWidth
    let h = img.naturalHeight

    if (options.width || options.height) {
      if (options.maintainAspectRatio) {
        const ratio = w / h
        if (options.width && options.height) {
          w = options.width
          h = options.height
        } else if (options.width) {
          w = options.width
          h = Math.round(w / ratio)
        } else {
          h = options.height!
          w = Math.round(h * ratio)
        }
      } else {
        if (options.width) w = options.width
        if (options.height) h = options.height
      }
    }

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) { reject(new Error('Could not get canvas context')); return }
    ctx.drawImage(img, 0, 0, w, h)

    const mimeMap: Record<string, string> = {
      png: 'image/png',
      webp: 'image/webp',
      jpeg: 'image/jpeg',
      bmp: 'image/bmp',
    }

    const mime = mimeMap[options.format]

    const quality = options.format === 'png' || options.format === 'bmp' ? undefined : options.quality

    canvas.toBlob((blob) => {
      if (!blob) { reject(new Error('Conversion failed')); return }
      resolve(blob)
    }, mime, quality)
  })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function downloadAllAsZip(
  entries: ConvertedEntry[],
  zipName = 'converted-images.zip',
) {
  const zip = new JSZip()
  for (const entry of entries) {
    zip.file(entry.name, entry.blob)
  }
  const blob = await zip.generateAsync({ type: 'blob' })
  downloadBlob(blob, zipName)
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

let idCounter = 0
export function nextId(): string {
  return `img_${++idCounter}_${Date.now()}`
}
