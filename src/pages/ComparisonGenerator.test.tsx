import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ComparisonGenerator from './ComparisonGenerator'

function renderPage() {
  return render(
    <MemoryRouter>
      <ComparisonGenerator />
    </MemoryRouter>,
  )
}

describe('ComparisonGenerator', () => {
  it('renders the heading', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Comparison Generator')
  })

  it('renders breadcrumb navigation', () => {
    renderPage()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('/')).toBeInTheDocument()
  })

  it('renders image input form groups', () => {
    renderPage()
    expect(screen.getByText('Image A')).toBeInTheDocument()
    expect(screen.getByText('Image B')).toBeInTheDocument()
  })

  it('renders file inputs', () => {
    renderPage()
    const inputs = screen.getAllByText('Choose image…')
    expect(inputs.length).toBe(2)
  })

  it('renders split slider label', () => {
    renderPage()
    expect(screen.getByText(/Split at/)).toBeInTheDocument()
  })

  it('renders add text checkbox', () => {
    renderPage()
    expect(screen.getByText('Add text')).toBeInTheDocument()
  })
})
