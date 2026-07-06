import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BatchPhotoConverter from './BatchPhotoConverter'

function renderPage() {
  return render(
    <MemoryRouter>
      <BatchPhotoConverter />
    </MemoryRouter>,
  )
}

describe('BatchPhotoConverter', () => {
  it('renders the heading', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Batch Photo Converter')
  })

  it('renders breadcrumb navigation', () => {
    renderPage()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('/')).toBeInTheDocument()
  })

  it('renders the file input with placeholder text', () => {
    renderPage()
    expect(screen.getByText('Choose images or drop them here…')).toBeInTheDocument()
  })
})
