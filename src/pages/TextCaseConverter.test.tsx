import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TextCaseConverter from './TextCaseConverter'

function renderPage() {
  return render(
    <MemoryRouter>
      <TextCaseConverter />
    </MemoryRouter>,
  )
}

function getInput(): HTMLTextAreaElement {
  return screen.getByPlaceholderText('Paste or type text here…')
}

function getOutput(): HTMLTextAreaElement {
  return screen.getByPlaceholderText('Result will appear here…')
}

function clickButton(name: string) {
  fireEvent.click(screen.getByText(name))
}

describe('TextCaseConverter', () => {
  it('renders the heading and breadcrumb', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Text Case Converter' })).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('renders all case buttons', () => {
    renderPage()
    expect(screen.getByText('Sentence case')).toBeInTheDocument()
    expect(screen.getByText('lower case')).toBeInTheDocument()
    expect(screen.getByText('UPPER CASE')).toBeInTheDocument()
    expect(screen.getByText('Capitalized Case')).toBeInTheDocument()
    expect(screen.getByText('aLtErNaTiNg cAsE')).toBeInTheDocument()
    expect(screen.getByText('InVeRsE CaSe')).toBeInTheDocument()
  })

  it('converts to sentence case', () => {
    renderPage()
    fireEvent.change(getInput(), { target: { value: 'hello WORLD' } })
    clickButton('Sentence case')
    expect(getOutput().value).toBe('Hello world')
  })

  it('converts to lower case', () => {
    renderPage()
    fireEvent.change(getInput(), { target: { value: 'Hello WORLD' } })
    clickButton('lower case')
    expect(getOutput().value).toBe('hello world')
  })

  it('converts to UPPER CASE', () => {
    renderPage()
    fireEvent.change(getInput(), { target: { value: 'Hello World' } })
    clickButton('UPPER CASE')
    expect(getOutput().value).toBe('HELLO WORLD')
  })

  it('converts to Capitalized Case', () => {
    renderPage()
    fireEvent.change(getInput(), { target: { value: 'hello world' } })
    clickButton('Capitalized Case')
    expect(getOutput().value).toBe('Hello World')
  })

  it('converts to aLtErNaTiNg cAsE', () => {
    renderPage()
    fireEvent.change(getInput(), { target: { value: 'hello' } })
    clickButton('aLtErNaTiNg cAsE')
    expect(getOutput().value).toBe('hElLo')
  })

  it('converts to InVeRsE CaSe', () => {
    renderPage()
    fireEvent.change(getInput(), { target: { value: 'Hello World' } })
    clickButton('InVeRsE CaSe')
    expect(getOutput().value).toBe('hELLO wORLD')
  })

  it('shows character count', () => {
    renderPage()
    fireEvent.change(getInput(), { target: { value: 'hello' } })
    expect(screen.getByText((content) => content.includes('5 characters'))).toBeInTheDocument()
  })

  it('shows word count', () => {
    renderPage()
    fireEvent.change(getInput(), { target: { value: 'hello world' } })
    expect(screen.getByText((content) => content.includes('2 words'))).toBeInTheDocument()
  })

  it('copy button is disabled when output is empty', () => {
    renderPage()
    expect(screen.getByText('Copy').closest('button')).toBeDisabled()
  })

  it('renders with tool page class', () => {
    const { container } = renderPage()
    expect(container.querySelector('.tool-page')).toBeInTheDocument()
  })
})
