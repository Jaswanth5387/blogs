import { renderMarkdown } from '../lib/renderMarkdown'

type Props = {
  markdown: string
}

export default function MarkdownContent({ markdown }: Props) {
  return <div className="markdown-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }} />
}
