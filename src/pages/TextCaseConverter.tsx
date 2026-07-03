import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, H3, TextArea, Classes, Intent } from '@blueprintjs/core'
import {
  sentenceCase,
  lowerCase,
  upperCase,
  capitalizedCase,
  alternatingCase,
  inverseCase,
} from '../lib/caseConverter'

type CaseKey = 'sentence' | 'lower' | 'upper' | 'capitalized' | 'alternating' | 'inverse'

const CASE_LABELS: Record<CaseKey, string> = {
  sentence: 'Sentence case',
  lower: 'lower case',
  upper: 'UPPER CASE',
  capitalized: 'Capitalized Case',
  alternating: 'aLtErNaTiNg cAsE',
  inverse: 'InVeRsE CaSe',
}

const CASE_ICONS: Record<CaseKey, string> = {
  sentence: 'paragraph',
  lower: 'symbol-triangle-down',
  upper: 'symbol-triangle-up',
  capitalized: 'header',
  alternating: 'style',
  inverse: 'swap-horizontal',
}

const TRANSFORM: Record<CaseKey, (text: string) => string> = {
  sentence: sentenceCase,
  lower: lowerCase,
  upper: upperCase,
  capitalized: capitalizedCase,
  alternating: alternatingCase,
  inverse: inverseCase,
}

export default function TextCaseConverter() {
  const [input, setInput] = useState('')
  const [selectedCase, setSelectedCase] = useState<CaseKey | null>(null)
  const [copied, setCopied] = useState(false)

  const output = useMemo(
    () => (selectedCase ? TRANSFORM[selectedCase](input) : ''),
    [input, selectedCase],
  )

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available
    }
  }

  const charCount = input.length
  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0

  return (
    <div className="tool-page">
      <p className={Classes.TEXT_MUTED} style={{ marginBottom: 8, fontSize: 14 }}>
        <Link to="/">Home</Link>
        <span style={{ margin: '0 6px' }}>/</span>
        Text Case Converter
      </p>
      <H3>Text Case Converter</H3>

      <TextArea
        fill
        large
        placeholder="Paste or type text here…"
        value={input}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
        style={{ minHeight: 120, resize: 'vertical', marginBottom: 12 }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {(Object.keys(CASE_LABELS) as CaseKey[]).map(key => (
          <Button
            key={key}
            icon={CASE_ICONS[key]}
            active={selectedCase === key}
            onClick={() => setSelectedCase(key)}
          >
            {CASE_LABELS[key]}
          </Button>
        ))}
      </div>

      <TextArea
        fill
        large
        readOnly
        placeholder="Result will appear here…"
        value={output}
        style={{ minHeight: 120, resize: 'vertical', marginBottom: 8 }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>
          {charCount} character{charCount !== 1 ? 's' : ''}
          {' · '}
          {wordCount} word{wordCount !== 1 ? 's' : ''}
        </span>
        <Button
          icon="clipboard"
          text={copied ? 'Copied!' : 'Copy'}
          onClick={handleCopy}
          disabled={!output}
          intent={copied ? Intent.SUCCESS : Intent.NONE}
        />
      </div>
    </div>
  )
}
