import { Route, Routes } from 'react-router-dom'
import { Button, ButtonGroup, Navbar, NavbarDivider, NavbarGroup, NavbarHeading } from '@blueprintjs/core'
import { Link } from 'react-router-dom'
import Home from './pages/Home'
import ComparisonGenerator from './pages/ComparisonGenerator'
import TextCaseConverter from './pages/TextCaseConverter'
import { useTheme } from './useTheme'

export default function App() {
  const { theme, setTheme } = useTheme()

  return (
    <>
      <Navbar>
        <NavbarGroup>
          <NavbarHeading>
            <Link to="/">tools<span style={{ fontSize: '0.7em' }}>.sker.lol</span></Link>
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
        <Route path="/text-case-converter" element={<TextCaseConverter />} />
      </Routes>
    </>
  )
}
