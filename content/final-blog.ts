import fs from 'fs'
import path from 'path'

const raw = fs.readFileSync(path.join(process.cwd(), 'final-blog.md'), 'utf8')

const markdown = raw
  .replace(/\r\n/g, '\n')
  .replace(/^# [^\n]+\n+_[^\n]+_[ \t]*\n+/, '')

const MARKERS = [
  '<!-- DEMO:AttentionSteps -->',
  '<!-- DEMO:AttentionHeatmap -->',
  '<!-- DEMO:PrefillVsDecode -->',
  '<!-- DEMO:KVCacheGrowth -->',
] as const

export function getArticleSections(): [string, string, string, string, string] {
  let remaining = markdown
  const sections: string[] = []

  for (const marker of MARKERS) {
    const idx = remaining.indexOf(marker)
    if (idx === -1) {
      sections.push(remaining)
      remaining = ''
      break
    }
    sections.push(remaining.slice(0, idx).trim())
    remaining = remaining.slice(idx + marker.length).trim()
  }
  sections.push(remaining)

  while (sections.length < 5) sections.push('')
  return sections.slice(0, 5) as [string, string, string, string, string]
}

export const finalBlogContent = markdown
