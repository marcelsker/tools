import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Checkbox,
  Classes,
  Dialog,
  FileInput,
  FormGroup,
  H3,
  HTMLSelect,
  InputGroup,
  Intent,
  Radio,
  RadioGroup,
  Slider,
} from '@blueprintjs/core'
import { drawComparison, loadImage } from '../lib/comparison'

export default function ComparisonGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imageA, setImageA] = useState<HTMLImageElement | null>(null)
  const [imageB, setImageB] = useState<HTMLImageElement | null>(null)
  const [fileNameA, setFileNameA] = useState<string | null>(null)
  const [fileNameB, setFileNameB] = useState<string | null>(null)
  const [loadingA, setLoadingA] = useState(false)
  const [loadingB, setLoadingB] = useState(false)
  const [split, setSplit] = useState(50)
  const [error, setError] = useState<string | null>(null)
  const [addText, setAddText] = useState(false)
  const [labelA, setLabelA] = useState('A')
  const [labelB, setLabelB] = useState('B')
  const [textFontSize, setTextFontSize] = useState(8)
  const [textColor, setTextColor] = useState('#ffffff')
  const [textPosition, setTextPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('top-left')
  const [textBold, setTextBold] = useState(true)
  const [textBackground, setTextBackground] = useState(true)
  const [dragOverA, setDragOverA] = useState(false)
  const [dragOverB, setDragOverB] = useState(false)
  const [resDialogOpen, setResDialogOpen] = useState(false)
  const [selectedRes, setSelectedRes] = useState<'high' | 'normal'>('normal')
  const [downloading, setDownloading] = useState(false)
  const [format, setFormat] = useState<'png' | 'webp' | 'jpeg'>('png')

  const HIGH_RES_THRESHOLD = 1920
  const NORMAL_RES_MAX = 1920

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !imageA || !imageB) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawComparison(ctx, imageA, imageB, split, addText ? {
      labelA, labelB,
      fontSize: textFontSize,
      color: textColor,
      position: textPosition,
      bold: textBold,
      background: textBackground,
    } : undefined)
  }, [imageA, imageB, split, addText, labelA, labelB, textFontSize, textColor, textPosition, textBold, textBackground])

  useEffect(() => {
    render()
  }, [render])

  async function loadFile(side: 'a' | 'b', file: File) {
    if (!file) return
    console.log('loadFile', side, file.name)

    const setLoad = side === 'a' ? setLoadingA : setLoadingB
    const setImage = side === 'a' ? setImageA : setImageB
    const setFileName = side === 'a' ? setFileNameA : setFileNameB
    setLoad(true)
    try {
      setError(null)
      const img = await loadImage(file)
      setImage(img)
      setFileName(file.name)
    } catch {
      setError('Could not load that image.')
    } finally {
      setLoad(false)
    }
  }

  function handleFile(
    side: 'a' | 'b',
    e: React.FormEvent<HTMLInputElement>,
  ) {
    const file = e.currentTarget.files?.[0]
    if (!file) return
    console.log('handleFile', side, file.name)
    loadFile(side, file)
  }

  function handleDragOver(side: 'a' | 'b', e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    console.log('dragOver', side)
    if (side === 'a') setDragOverA(true)
    else setDragOverB(true)
  }

  function handleDragLeave(side: 'a' | 'b') {
    console.log('dragLeave', side)
    if (side === 'a') setDragOverA(false)
    else setDragOverB(false)
  }

  function handleDrop(side: 'a' | 'b', e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    console.log('drop', side)
    if (side === 'a') setDragOverA(false)
    else setDragOverB(false)
    const file = e.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    loadFile(side, file)
  }

  function getTextOptions() {
    return addText ? {
      labelA, labelB,
      fontSize: textFontSize,
      color: textColor,
      position: textPosition,
      bold: textBold,
      background: textBackground,
    } : undefined
  }

  const MIME: Record<typeof format, string> = { png: 'image/png', webp: 'image/webp', jpeg: 'image/jpeg' }

  function doExport(scale: number) {
    const canvas = canvasRef.current
    if (!canvas || !imageA || !imageB) return

    const outW = Math.round(canvas.width * scale)
    const outH = Math.round(canvas.height * scale)

    const offscreen = document.createElement('canvas')
    offscreen.width = outW
    offscreen.height = outH
    const ctx = offscreen.getContext('2d')
    if (!ctx) return

    if (scale === 1) {
      drawComparison(ctx, imageA, imageB, split, getTextOptions())
    } else {
      const temp = document.createElement('canvas')
      temp.width = canvas.width
      temp.height = canvas.height
      const tempCtx = temp.getContext('2d')
      if (!tempCtx) return
      drawComparison(tempCtx, imageA, imageB, split, getTextOptions())
      ctx.drawImage(temp, 0, 0, outW, outH)
    }

    const link = document.createElement('a')
    link.download = `comparison.${format}`
    offscreen.toBlob((blob) => {
      if (!blob) return
      link.href = URL.createObjectURL(blob)
      link.click()
      URL.revokeObjectURL(link.href)
    }, MIME[format])
  }

  function download() {
    if (!canvasRef.current || !imageA || !imageB) return
    console.log('download')

    const isHighRes =
      imageA.naturalWidth > HIGH_RES_THRESHOLD ||
      imageA.naturalHeight > HIGH_RES_THRESHOLD ||
      imageB.naturalWidth > HIGH_RES_THRESHOLD ||
      imageB.naturalHeight > HIGH_RES_THRESHOLD

    if (isHighRes) {
      setSelectedRes('normal')
      setResDialogOpen(true)
    } else {
      setDownloading(true)
      setTimeout(() => {
        doExport(1)
        setDownloading(false)
      }, 0)
    }
  }

  function handleDownloadConfirm() {
    console.log('downloadConfirm', selectedRes)
    const canvas = canvasRef.current
    if (!canvas) return
    const scale = selectedRes === 'high'
      ? 1
      : Math.min(NORMAL_RES_MAX / canvas.width, NORMAL_RES_MAX / canvas.height, 1)

    setDownloading(true)
    setTimeout(() => {
      doExport(scale)
      setDownloading(false)
      setResDialogOpen(false)
    }, 0)
  }

  const ready = imageA && imageB

  return (
    <div className="tool-page">
      <p className={Classes.TEXT_MUTED} style={{ marginBottom: 8, fontSize: 14 }}>
        <Link to="/">Home</Link>
        <span style={{ margin: '0 6px' }}>/</span>
        Comparison Generator
      </p>
      <H3>Comparison Generator</H3>
      <p className={Classes.TEXT_MUTED} style={{ marginTop: 8 }}>
        Upload two images and set the split point. The result is half the source
        width — left from image A, right from image B.
      </p>

      <div className="image-inputs">
        <FormGroup label="Image A" labelFor="image-a">
          <FileInput
            id="image-a"
            fill
            className={dragOverA ? 'bp5-file-drop-active' : undefined}
            text={loadingA ? 'Loading…' : (imageA ? fileNameA! : 'Choose image…')}
            onInputChange={(e) => handleFile('a', e)}
            inputProps={{ accept: 'image/*' }}
            disabled={loadingA}
            onDragOver={(e) => handleDragOver('a', e)}
            onDragLeave={() => handleDragLeave('a')}
            onDrop={(e) => handleDrop('a', e)}
          />
        </FormGroup>
        <FormGroup label="Image B" labelFor="image-b">
          <FileInput
            id="image-b"
            fill
            className={dragOverB ? 'bp5-file-drop-active' : undefined}
            text={loadingB ? 'Loading…' : (imageB ? fileNameB! : 'Choose image…')}
            onInputChange={(e) => handleFile('b', e)}
            inputProps={{ accept: 'image/*' }}
            disabled={loadingB}
            onDragOver={(e) => handleDragOver('b', e)}
            onDragLeave={() => handleDragLeave('b')}
            onDrop={(e) => handleDrop('b', e)}
          />
        </FormGroup>
      </div>

      <FormGroup label={`Split at ${split}%`}>
        <Slider
          className="comparison-slider"
          min={0}
          max={100}
          stepSize={1}
          labelStepSize={25}
          value={split}
          onChange={(v) => { console.log('split', v); setSplit(v) }}
          disabled={!ready}
        />
      </FormGroup>

      <Checkbox
        checked={addText}
        onChange={(e) => { console.log('addText', e.target.checked); setAddText(e.target.checked) }}
        label="Add text"
      />

      {addText && (
        <div className="text-options">
          <div className="image-inputs">
            <FormGroup label="Label A" labelFor="label-a">
              <InputGroup
                id="label-a"
                value={labelA}
                onChange={(e) => { console.log('labelA', e.target.value); setLabelA(e.target.value) }}
              />
            </FormGroup>
            <FormGroup label="Label B" labelFor="label-b">
              <InputGroup
                id="label-b"
                value={labelB}
                onChange={(e) => { console.log('labelB', e.target.value); setLabelB(e.target.value) }}
              />
            </FormGroup>
          </div>

          <FormGroup label={`Font size: ${textFontSize}%`}>
            <Slider
              min={2}
              max={20}
              stepSize={1}
              value={textFontSize}
                  onChange={(v) => { console.log('textFontSize', v); setTextFontSize(v) }}
              labelStepSize={4}
            />
          </FormGroup>

          <div className="image-inputs">
            <FormGroup label="Color" labelFor="text-color">
              <input
                id="text-color"
                type="color"
                value={textColor}
                onChange={(e) => { console.log('textColor', e.target.value); setTextColor(e.target.value) }}
                style={{ width: '100%', height: 32, padding: 0, border: 'none', cursor: 'pointer' }}
              />
            </FormGroup>
            <FormGroup label="Position" labelFor="text-position">
              <HTMLSelect
                id="text-position"
                value={textPosition}
                onChange={(e) => { const v = e.target.value as 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'; console.log('textPosition', v); setTextPosition(v) }}
                options={[
                  { label: 'Top Left', value: 'top-left' },
                  { label: 'Top Right', value: 'top-right' },
                  { label: 'Bottom Left', value: 'bottom-left' },
                  { label: 'Bottom Right', value: 'bottom-right' },
                ]}
                fill
              />
            </FormGroup>
          </div>

          <div className="image-inputs">
            <Checkbox
              checked={textBold}
              onChange={(e) => { console.log('textBold', e.target.checked); setTextBold(e.target.checked) }}
              label="Bold"
            />
            <Checkbox
              checked={textBackground}
              onChange={(e) => { console.log('textBackground', e.target.checked); setTextBackground(e.target.checked) }}
              label="Background"
            />
          </div>
        </div>
      )}

      {error && (
        <p className="error-text" style={{ marginTop: 12 }}>{error}</p>
      )}

      {ready && (
        <>
          <div className="comparison-preview" style={{ marginTop: 20 }}>
            <canvas ref={canvasRef} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <Button
              intent={Intent.PRIMARY}
              icon="download"
              text="Download"
              onClick={download}
              loading={downloading && !resDialogOpen}
            />
            <HTMLSelect
              value={format}
              onChange={(e) => { const v = e.target.value as typeof format; console.log('format', v); setFormat(v) }}
              options={[
                { label: 'PNG', value: 'png' },
                { label: 'WebP', value: 'webp' },
                { label: 'JPEG', value: 'jpeg' },
              ]}
            />
          </div>
        </>
      )}

      <Dialog
        isOpen={resDialogOpen}
        onClose={() => { console.log('dialogClose'); if (!downloading) setResDialogOpen(false) }}
        title="Download Resolution"
        icon="duplicate"
        canOutsideClickClose={!downloading}
      >
        <div className={Classes.DIALOG_BODY}>
          <p>
            The uploaded images are high resolution. How would you like to
            download the comparison?
          </p>
          <RadioGroup
            selectedValue={selectedRes}
            onChange={(e) => { const v = e.currentTarget.value as 'high' | 'normal'; console.log('selectedRes', v); setSelectedRes(v) }}
            disabled={downloading}
          >
            <Radio
              label="High Resolution (original size)"
              value="high"
            />
            <Radio
              label={`Normal Resolution (max ${NORMAL_RES_MAX}px).`}
              value="normal"
            />
          </RadioGroup>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={() => { console.log('dialogCancel'); setResDialogOpen(false) }} disabled={downloading}>Cancel</Button>
            <Button intent={Intent.PRIMARY} onClick={handleDownloadConfirm} loading={downloading && resDialogOpen}>
              Download
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
