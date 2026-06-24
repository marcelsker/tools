import { Card, Classes, H3 } from '@blueprintjs/core'
import { Link } from 'react-router-dom'
import { tools } from '../tools'

export default function Home() {
  return (
    <div className="tool-page">
      <H3>Tools</H3>
      <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        {tools.map((tool) => (
          <Link key={tool.id} to={tool.path} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card interactive onClick={() => console.log('navigate', tool.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong>{tool.name}</strong>
              </div>
              <p className={Classes.TEXT_MUTED} style={{ margin: '8px 0 0' }}>{tool.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
