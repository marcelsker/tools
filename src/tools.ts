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
  {
    id: 'text-case-converter',
    name: 'Text Case Converter',
    description: 'Transform text between different letter cases.',
    path: '/text-case-converter',
  },
]
