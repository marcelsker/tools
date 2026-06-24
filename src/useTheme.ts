import { useEffect, useState } from 'react'

export type Theme = 'system' | 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'system'
  })

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('bp5-dark')
    } else if (theme === 'light') {
      root.classList.remove('bp5-dark')
    } else {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      root.classList.toggle('bp5-dark', mq.matches)
      const handler = (e: MediaQueryListEvent) => root.classList.toggle('bp5-dark', e.matches)
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [theme])

  return { theme, setTheme: (t: Theme) => { console.log('theme', t); localStorage.setItem('theme', t); setTheme(t) } }
}
