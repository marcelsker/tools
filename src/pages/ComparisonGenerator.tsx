import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Button,
  Checkbox,
  FileInput,
  FormGroup,
  H3,
  HTMLSelect,
  InputGroup,
  Slider,
  Intent,
} from '@blueprintjs/core'
import { drawComparison, loadImage } from '../lib/comparison'

export default function ComparisonGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imageA, setImageA] = useState<HTMLImageElement | null>(null)
  const [imageB, setImageB] = useState<HTMLImageElement | null>(null)
  const [fileNameA, setFileNameA] = useState<string | null>(null)
  const [fileNameB, setFileNameB] = useState<string | null>(null)
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

  async function handleFile(
    side: 'a' | 'b',
    e: React.FormEvent<HTMLInputElement>,
  ) {
    const file = e.currentTarget.files?.[0]
    if (!file) return

    try {
      setError(null)
      const img = await loadImage(file)
      if (side === 'a') {
        setImageA(img)
        setFileNameA(file.name)
      } else {
        setImageB(img)
        setFileNameB(file.name)
      }
    } catch {
      setError('Could not load that image.')
    }
  }

  function download() {
    const canvas = canvasRef.current
    if (!canvas || !imageA || !imageB) return
    const link = document.createElement('a')
    link.download = 'comparison.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const ready = imageA && imageB

  return (
    <div className="tool-page">
      <H3>Comparison Generator</H3>
      <p style={{ color: '#5c7080', marginTop: 8 }}>
        Upload two images and set the split point. The result is half the source
        width — left from image A, right from image B.
      </p>

      <div className="image-inputs">
        <FormGroup label="Image A" labelFor="image-a">
          <FileInput
            id="image-a"
            text={imageA ? fileNameA! : 'Choose image…'}
            onInputChange={(e) => handleFile('a', e)}
            inputProps={{ accept: 'image/*' }}
          />
        </FormGroup>
        <FormGroup label="Image B" labelFor="image-b">
          <FileInput
            id="image-b"
            text={imageB ? fileNameB! : 'Choose image…'}
            onInputChange={(e) => handleFile('b', e)}
            inputProps={{ accept: 'image/*' }}
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
          onChange={setSplit}
          disabled={!ready}
        />
      </FormGroup>

      <Checkbox
        checked={addText}
        onChange={(e) => setAddText(e.target.checked)}
        label="Add text"
      />

      {addText && (
        <div className="text-options">
          <div className="image-inputs">
            <FormGroup label="Label A" labelFor="label-a">
              <InputGroup
                id="label-a"
                value={labelA}
                onChange={(e) => setLabelA(e.target.value)}
              />
            </FormGroup>
            <FormGroup label="Label B" labelFor="label-b">
              <InputGroup
                id="label-b"
                value={labelB}
                onChange={(e) => setLabelB(e.target.value)}
              />
            </FormGroup>
          </div>

          <FormGroup label={`Font size: ${textFontSize}%`}>
            <Slider
              min={2}
              max={20}
              stepSize={1}
              value={textFontSize}
              onChange={setTextFontSize}
              labelStepSize={4}
            />
          </FormGroup>

          <div className="image-inputs">
            <FormGroup label="Color" labelFor="text-color">
              <input
                id="text-color"
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                style={{ width: '100%', height: 32, padding: 0, border: 'none', cursor: 'pointer' }}
              />
            </FormGroup>
            <FormGroup label="Position" labelFor="text-position">
              <HTMLSelect
                id="text-position"
                value={textPosition}
                onChange={(e) => setTextPosition(e.target.value as 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right')}
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
              onChange={(e) => setTextBold(e.target.checked)}
              label="Bold"
            />
            <Checkbox
              checked={textBackground}
              onChange={(e) => setTextBackground(e.target.checked)}
              label="Background"
            />
          </div>
        </div>
      )}

      {error && (
        <p style={{ color: '#c23030', marginTop: 12 }}>{error}</p>
      )}

      {ready && (
        <>
          <div className="comparison-preview" style={{ marginTop: 20 }}>
            <canvas ref={canvasRef} />
          </div>
          <Button
            intent={Intent.PRIMARY}
            icon="download"
            text="Download PNG"
            onClick={download}
            style={{ marginTop: 16 }}
          />
        </>
      )}
    </div>
  )
}
