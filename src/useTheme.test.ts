import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('bp5-dark')
})

afterEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('bp5-dark')
})

describe('useTheme', () => {
  it('defaults to system when localStorage is empty', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('system')
  })

  it('reads theme from localStorage', () => {
    localStorage.setItem('theme', 'dark')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
  })

  it('applies bp5-dark on dark theme', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setTheme('dark'))
    expect(document.documentElement.classList.contains('bp5-dark')).toBe(true)
  })

  it('removes bp5-dark on light theme', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setTheme('light'))
    expect(document.documentElement.classList.contains('bp5-dark')).toBe(false)
  })

  it('persists theme to localStorage', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setTheme('dark'))
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('switches between themes correctly', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setTheme('dark'))
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('bp5-dark')).toBe(true)

    act(() => result.current.setTheme('light'))
    expect(result.current.theme).toBe('light')
    expect(document.documentElement.classList.contains('bp5-dark')).toBe(false)

    act(() => result.current.setTheme('system'))
    expect(result.current.theme).toBe('system')
  })

  it('listens to matchMedia in system mode', () => {
    const addEventListener = vi.fn()
    const removeEventListener = vi.fn()
    vi.stubGlobal('matchMedia', vi.fn(() => ({
      matches: true,
      addEventListener,
      removeEventListener,
    })))

    const { unmount } = renderHook(() => useTheme())
    expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function))

    unmount()
    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))

    vi.unstubAllGlobals()
  })
})
