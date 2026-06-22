'use client'

import MarkdownContent from './MarkdownContent'
import AttentionSteps from './visualizations/AttentionSteps'
import AttentionHeatmap from './visualizations/AttentionHeatmap'
import PrefillVsDecode from './visualizations/PrefillVsDecode'
import KVCacheGrowth from './visualizations/KVCacheGrowth'

type Props = {
  sections: [string, string, string, string, string]
}

export default function ArticleWithDemos({ sections }: Props) {
  return (
    <>
      <MarkdownContent markdown={sections[0]} />

      <div className="demo-callout">
        <div className="demo-callout-label">How It Works</div>
        <AttentionSteps />
      </div>

      <MarkdownContent markdown={sections[1]} />

      <div className="demo-callout">
        <div className="demo-callout-label">Try It Yourself</div>
        <AttentionHeatmap />
      </div>

      <MarkdownContent markdown={sections[2]} />

      <div className="demo-callout">
        <div className="demo-callout-label">Try It Yourself</div>
        <PrefillVsDecode />
      </div>

      <MarkdownContent markdown={sections[3]} />

      <div className="demo-callout">
        <div className="demo-callout-label">Try It Yourself</div>
        <KVCacheGrowth />
      </div>

      <MarkdownContent markdown={sections[4]} />
    </>
  )
}
