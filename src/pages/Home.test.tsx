import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'
import { tools } from '../tools'

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  )
}

describe('Home', () => {
  it('renders the heading', () => {
    renderHome()
    expect(screen.getByText('Tools')).toBeInTheDocument()
  })

  it('renders a card for each tool', () => {
    renderHome()
    for (const tool of tools) {
      expect(screen.getByText(tool.name)).toBeInTheDocument()
      expect(screen.getByText(tool.description)).toBeInTheDocument()
    }
  })

  it('links point to correct tool paths', () => {
    renderHome()
    for (const tool of tools) {
      const link = screen.getByText(tool.name).closest('a')
      expect(link).toHaveAttribute('href', tool.path)
    }
  })
})
