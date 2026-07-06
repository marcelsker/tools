import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Checkbox,
  Classes,
  FileInput,
  H3,
  HTMLSelect,
  InputGroup,
  Intent,
  Slider,
} from '@blueprintjs/core'
import {
  type ConvertOptions,
  type ConvertedEntry,
  type ImageEntry,
  convertImage,
  createThumbnail,
  downloadAllAsZip,
  downloadBlob,
  loadImage,
  nextId,
} from '../lib/photoConverter'

export default function BatchPhotoConverter() {
  const [images, setImages] = useState<ImageEntry[]>([])
  const [converted, setConverted] = useState<ConvertedEntry[]>([])
  const [converting, setConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [format, setFormat] = useState<ConvertOptions['format']>('png')
  const [quality, setQuality] = useState(92)
  const [resizeWidth, setResizeWidth] = useState('')
  const [resizeHeight, setResizeHeight] = useState('')
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)

  async function addFiles(files: FileList | File[]) {
    setError(null)
    const fileArr = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (fileArr.length === 0) { setError('No image files found.'); return }

    const newEntries: ImageEntry[] = []
    for (const file of fileArr) {
      try {
        const img = await loadImage(file)
        const thumbnailUrl = await createThumbnail(file)
        newEntries.push({ id: nextId(), file, img, thumbnailUrl })
      } catch {
        setError(`Could not load ${file.name}. Skipping.`)
      }
    }
    setImages(prev => [...prev, ...newEntries])
  }

  function handleFileInput(e: React.FormEvent<HTMLInputElement>) {
    const files = e.currentTarget.files
    if (!files) return
    addFiles(files)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (!files) return
    addFiles(files)
  }

  function removeImage(id: string) {
    setImages(prev => prev.filter(i => i.id !== id))
    setConverted(prev => prev.filter(c => c.id !== id))
  }

  function clearAll() {
    setImages([])
    setConverted([])
    setError(null)
    setProgress(0)
  }

  const getOptions = useCallback((): ConvertOptions => ({
    format,
    quality: quality / 100,
    width: resizeWidth ? Number(resizeWidth) : undefined,
    height: resizeHeight ? Number(resizeHeight) : undefined,
    maintainAspectRatio,
  }), [format, quality, resizeWidth, resizeHeight, maintainAspectRatio])

  async function handleConvert() {
    if (images.length === 0) return
    setConverting(true)
    setProgress(0)
    setError(null)

    const options = getOptions()
    const results: ConvertedEntry[] = []
    const ext = options.format === 'jpeg' ? 'jpg' : options.format

    for (let i = 0; i < images.length; i++) {
      const entry = images[i]
      try {
        const blob = await convertImage(entry.img, options)
        const baseName = entry.file.name.replace(/\.[^.]+$/, '')
        results.push({ id: entry.id, name: `${baseName}.${ext}`, blob, url: URL.createObjectURL(blob) })
      } catch {
        setError(`Failed to convert ${entry.file.name}.`)
      }
      setProgress(i + 1)
    }

    setConverted(results)
    setConverting(false)
  }

  async function handleDownloadAll() {
    if (converted.length === 0) return
    await downloadAllAsZip(converted)
  }

  function handleDownloadSingle(entry: ConvertedEntry) {
    downloadBlob(entry.blob, entry.name)
  }

  const showQualitySlider = format === 'jpeg' || format === 'webp'

  return (
    <div className="tool-page">
      <p className={Classes.TEXT_MUTED} style={{ marginBottom: 8, fontSize: 14 }}>
        <Link to="/">Home</Link>
        <span style={{ margin: '0 6px' }}>/</span>
        Batch Photo Converter
      </p>
      <H3>Batch Photo Converter</H3>

      <FileInput
        fill
        multiple
        className={dragOver ? 'bp5-file-drop-active' : undefined}
        text={images.length === 0 ? 'Choose images or drop them here…' : `${images.length} selected`}
        onInputChange={handleFileInput}
        inputProps={{ accept: 'image/*', multiple: true }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ marginBottom: 12 }}
      />

      {images.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div className="converter-thumbnails">
            {images.map(entry => (
              <div key={entry.id} className="converter-thumb">
                <img src={entry.thumbnailUrl} alt={entry.file.name} />
                <Button
                  small
                  minimal
                  icon="cross"
                  className="converter-thumb-remove"
                  onClick={() => removeImage(entry.id)}
                  disabled={converting}
                />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
            <span className={Classes.TEXT_MUTED}>{images.length} image{images.length === 1 ? '' : 's'}</span>
            <Button small minimal icon="trash" text="Clear" onClick={clearAll} disabled={converting} />
            <div style={{ flex: 1 }} />
            <HTMLSelect
              value={format}
              onChange={e => setFormat(e.target.value as ConvertOptions['format'])}
              options={[
                { label: 'PNG', value: 'png' },
                { label: 'WebP', value: 'webp' },
                { label: 'JPEG', value: 'jpeg' },
                { label: 'BMP', value: 'bmp' },
              ]}
            />
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {showQualitySlider && (
              <Slider
                min={1}
                max={100}
                stepSize={1}
                labelStepSize={50}
                value={quality}
                onChange={v => setQuality(v)}
                style={{ width: 120 }}
              />
            )}
            <InputGroup
              type="number"
              placeholder="W"
              value={resizeWidth}
              onChange={e => setResizeWidth(e.target.value)}
              style={{ width: 70 }}
            />
            <span className={Classes.TEXT_MUTED} style={{ fontSize: 13 }}>×</span>
            <InputGroup
              type="number"
              placeholder="H"
              value={resizeHeight}
              onChange={e => setResizeHeight(e.target.value)}
              style={{ width: 70 }}
            />
            <Checkbox
              checked={maintainAspectRatio}
              onChange={e => setMaintainAspectRatio(e.target.checked)}
              label="AR"
              style={{ margin: 0 }}
            />
            <div style={{ flex: 1 }} />
            <Button
              intent={Intent.PRIMARY}
              icon="refresh"
              text={converting ? `${progress}/${images.length}` : 'Convert'}
              onClick={handleConvert}
              loading={converting}
            />
          </div>
        </div>
      )}

      {error && (
        <p className="error-text" style={{ marginBottom: 12 }}>{error}</p>
      )}

      {converted.length > 0 && !converting && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <Button
              intent={Intent.SUCCESS}
              icon="compressed"
              text="Download All ZIP"
              onClick={handleDownloadAll}
              small
            />
            <div style={{ flex: 1 }} />
            <span className={Classes.TEXT_MUTED} style={{ fontSize: 13 }}>{converted.length} converted</span>
          </div>
          <div className="converter-thumbnails">
            {converted.map(entry => (
              <div key={entry.id} className="converter-thumb">
                <img src={entry.url} alt={entry.name} />
                <Button
                  small
                  icon="download"
                  className="converter-thumb-download"
                  onClick={() => handleDownloadSingle(entry)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
