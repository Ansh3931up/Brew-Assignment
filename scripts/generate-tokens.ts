import fs from 'fs'
import path from 'path'
import { theme } from '../styles/theme'

// Use unknown and type guards to avoid circular reference
const flatten = (obj: unknown, prefix = 'color'): Record<string, string> => {
  const vars: Record<string, string> = {}

  const walk = (node: unknown, keyPrefix: string): void => {
    if (typeof node !== 'object' || node === null) return

    for (const key in node) {
      const value = (node as Record<string, unknown>)[key]
      const newKey = `${keyPrefix}-${key}`

      if (typeof value === 'string') {
        vars[`--${newKey}`] = value
      } else if (typeof value === 'object' && value !== null) {
        walk(value, newKey)
      }
    }
  }

  walk(obj, prefix)
  return vars
}

const vars = flatten(theme.colors)

const css = `:root {\n${Object.entries(vars)
  .map(([key, value]) => `  ${key}: ${value};`)
  .join('\n')}\n}\n`

const filePath = path.join(process.cwd(), 'styles/tokens.css')

fs.writeFileSync(filePath, css)

console.log('✅ tokens.css generated from theme.ts')
