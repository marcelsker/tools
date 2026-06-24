import { Route, Routes } from 'react-router-dom'
import { Navbar, NavbarGroup, NavbarHeading } from '@blueprintjs/core'
import { Link } from 'react-router-dom'
import Home from './pages/Home'
import ComparisonGenerator from './pages/ComparisonGenerator'

export default function App() {
  return (
    <>
      <Navbar>
        <NavbarGroup>
          <NavbarHeading>
            <Link to="/">Tools</Link>
          </NavbarHeading>
        </NavbarGroup>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comparison-generator" element={<ComparisonGenerator />} />
      </Routes>
    </>
  )
}
