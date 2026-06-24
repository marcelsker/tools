import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Button, ButtonGroup, Navbar, NavbarDivider, NavbarGroup, NavbarHeading } from '@blueprintjs/core'
import { Link } from 'react-router-dom'
import Home from './pages/Home'
import ComparisonGenerator from './pages/ComparisonGenerator'

type Theme = 'system' | 'light' | 'dark'

function useTheme() {
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

  return { theme, setTheme: (t: Theme) => { localStorage.setItem('theme', t); setTheme(t) } }
}

export default function App() {
  const { theme, setTheme } = useTheme()

  return (
    <>
      <Navbar>
        <NavbarGroup>
          <NavbarHeading>
            <Link to="/">Tools</Link>
          </NavbarHeading>
          <NavbarDivider />
          <ButtonGroup minimal>
            <Button icon="desktop" active={theme === 'system'} onClick={() => setTheme('system')} />
            <Button icon="flash" active={theme === 'light'} onClick={() => setTheme('light')} />
            <Button icon="moon" active={theme === 'dark'} onClick={() => setTheme('dark')} />
          </ButtonGroup>
        </NavbarGroup>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comparison-generator" element={<ComparisonGenerator />} />
      </Routes>
    </>
  )
}
