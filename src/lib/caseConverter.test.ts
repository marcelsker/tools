import { describe, it, expect } from 'vitest'
import { sentenceCase, lowerCase, upperCase, capitalizedCase, alternatingCase, inverseCase } from './caseConverter'

describe('sentenceCase', () => {
  it('capitalizes first letter and lowercases rest', () => {
    expect(sentenceCase('hello world')).toBe('Hello world')
    expect(sentenceCase('HELLO WORLD')).toBe('Hello world')
    expect(sentenceCase('hELLO wORLD')).toBe('Hello world')
    expect(sentenceCase('')).toBe('')
  })
})

describe('lowerCase', () => {
  it('lowercases all characters', () => {
    expect(lowerCase('Hello World')).toBe('hello world')
    expect(lowerCase('HELLO')).toBe('hello')
    expect(lowerCase('')).toBe('')
  })
})

describe('upperCase', () => {
  it('uppercases all characters', () => {
    expect(upperCase('Hello World')).toBe('HELLO WORLD')
    expect(upperCase('hello')).toBe('HELLO')
    expect(upperCase('')).toBe('')
  })
})

describe('capitalizedCase', () => {
  it('capitalizes first letter of each word, lowercases rest', () => {
    expect(capitalizedCase('hello world')).toBe('Hello World')
    expect(capitalizedCase('HELLO WORLD')).toBe('Hello World')
    expect(capitalizedCase('hElLo WoRlD')).toBe('Hello World')
    expect(capitalizedCase('')).toBe('')
    expect(capitalizedCase('hello   world')).toBe('Hello World')
  })
})

describe('alternatingCase', () => {
  it('alternates case starting with lowercase', () => {
    expect(alternatingCase('hello')).toBe('hElLo')
    expect(alternatingCase('HELLO')).toBe('hElLo')
    expect(alternatingCase('abc123')).toBe('aBc123')
    expect(alternatingCase('')).toBe('')
  })
})

describe('inverseCase', () => {
  it('swaps case of each character', () => {
    expect(inverseCase('Hello World')).toBe('hELLO wORLD')
    expect(inverseCase('123')).toBe('123')
    expect(inverseCase('')).toBe('')
  })
})
