import { getArticleSections } from '../content/final-blog'
import ArticleWithDemos from '../components/ArticleWithDemos'
import StoryCarousel from '../components/StoryCarousel'

export default function Home() {
  const sections = getArticleSections()
  return (
    <main className="page-container">
      <article className="page-article">
        {/* Hero */}
        <div className="article-hero">
          <div className="badge">Engineering Deep Dive</div>
          <h1>KV Cache: The Story That Scaled ChatGPT</h1>
          <p className="lead">
            Why does ChatGPT respond so fast even for long conversations? The answer is a deceptively simple trick called the KV cache. This guide explains it from the ground up — with interactive demos at every step.
          </p>
          <div className="hero-meta">
            <span className="hero-tag">🧠 Transformers</span>
            <span className="hero-tag">⚡ GPU Inference</span>
            <span className="hero-tag">📐 Attention</span>
            <span className="hero-tag">🗄️ Memory</span>
          </div>
        </div>

        <div className="article-divider" />

        <StoryCarousel />

        <div className="deep-dive-marker">
          <span>Full deep dive ↓</span>
        </div>

        <ArticleWithDemos sections={sections} />
      </article>
    </main>
  )
}
