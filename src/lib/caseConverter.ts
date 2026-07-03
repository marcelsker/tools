export function sentenceCase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function lowerCase(text: string): string {
  return text.toLowerCase()
}

export function upperCase(text: string): string {
  return text.toUpperCase()
}

export function capitalizedCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function alternatingCase(text: string): string {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (/[a-zA-Z]/.test(ch)) {
      result += i % 2 === 0 ? ch.toLowerCase() : ch.toUpperCase()
    } else {
      result += ch
    }
  }
  return result
}

export function inverseCase(text: string): string {
  let result = ''
  for (const ch of text) {
    if (ch >= 'a' && ch <= 'z') {
      result += ch.toUpperCase()
    } else if (ch >= 'A' && ch <= 'Z') {
      result += ch.toLowerCase()
    } else {
      result += ch
    }
  }
  return result
}

export type CaseTransform = (text: string) => string

export const transforms: Record<string, CaseTransform> = {
  sentence: sentenceCase,
  lower: lowerCase,
  upper: upperCase,
  capitalized: capitalizedCase,
  alternating: alternatingCase,
  inverse: inverseCase,
}
