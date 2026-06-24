export type Tool = {
  id: string
  name: string
  description: string
  path: string
}

export const tools: Tool[] = [
  {
    id: 'comparison-generator',
    name: 'Comparison Generator',
    description: 'Combine two images into a half-width comparison with an adjustable split.',
    path: '/comparison-generator',
  },
]
