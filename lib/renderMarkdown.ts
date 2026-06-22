export function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function slugify(raw: string) {
  return raw
    .toLowerCase()
    .replace(/—/g, '-')
    .replace(/\s/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

function renderInline(raw: string): string {
  let s = escapeHtml(raw)
  // links: [text](href) — brackets and parens survive escapeHtml
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  // bold — must come before italic so ** is consumed before *
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>')
  // italic — word-boundary guards prevent matching snake_case identifiers
  s = s.replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
  s = s.replace(/(?<![a-zA-Z0-9])_([^_\n]+)_(?![a-zA-Z0-9])/g, '<em>$1</em>')
  // inline code
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>')
  return s
}

export function renderMarkdown(markdown: string) {
  const lines = markdown.split('\n')
  let html = ''
  let inCode = false
  let codeLang = ''
  let inUl = false
  let inOl = false

  const closeLists = () => {
    if (inUl) { html += '</ul>'; inUl = false }
    if (inOl) { html += '</ol>'; inOl = false }
  }

  for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, '')

    if (line.startsWith('```')) {
      if (!inCode) {
        codeLang = line.slice(3).trim()
        html += `<pre><code class="language-${escapeHtml(codeLang)}">`
        inCode = true
      } else {
        html += '</code></pre>'
        inCode = false
      }
      continue
    }

    if (inCode) {
      html += `${escapeHtml(line)}\n`
      continue
    }

    if (line.trim() === '') {
      closeLists()
      continue
    }

    // Horizontal rule
    if (/^---+$/.test(line) || /^\*\*\*+$/.test(line) || /^___+$/.test(line)) {
      closeLists()
      html += '<hr />'
      continue
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/)
    if (headingMatch) {
      closeLists()
      const level = headingMatch[1].length
      const rawText = headingMatch[2]
      // Strip backticks from the raw text before slugifying
      const id = slugify(rawText.replace(/`([^`]+)`/g, '$1'))
      const content = renderInline(rawText)
      html += `<h${level} id="${id}">${content}</h${level}>`
      continue
    }

    const ulMatch = line.match(/^\s*[-*+]\s+(.*)$/)
    if (ulMatch) {
      if (!inUl) { closeLists(); html += '<ul>'; inUl = true }
      html += `<li>${renderInline(ulMatch[1])}</li>`
      continue
    }

    const olMatch = line.match(/^\s*\d+\.\s+(.*)$/)
    if (olMatch) {
      if (!inOl) { closeLists(); html += '<ol>'; inOl = true }
      html += `<li>${renderInline(olMatch[1])}</li>`
      continue
    }

    closeLists()
    html += `<p>${renderInline(line)}</p>`
  }

  closeLists()
  return html
}
