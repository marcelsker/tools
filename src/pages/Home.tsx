import { Card, H3, Tag } from '@blueprintjs/core'
import { Link } from 'react-router-dom'
import { tools } from '../tools'

export default function Home() {
  return (
    <div className="tool-page">
      <H3>Tools</H3>
      <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        {tools.map((tool) => (
          <Link key={tool.id} to={tool.path} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card interactive>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong>{tool.name}</strong>
                <Tag minimal>client</Tag>
              </div>
              <p style={{ margin: '8px 0 0', color: '#5c7080' }}>{tool.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
