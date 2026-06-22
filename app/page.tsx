import { getArticleSections } from '../content/final-blog'
import ArticleWithDemos from '../components/ArticleWithDemos'

export default function Home() {
  const sections = getArticleSections()
  return (
    <main className="page-container">
      <article className="page-article">
        <div className="badge">KV Cache</div>
        <h1>KV Cache: The Story That Scaled ChatGPT</h1>
        <p className="lead">A story-driven engineering deep dive into KV caching for autoregressive inference, long context, and production-scale GPU deployment.</p>
        <ArticleWithDemos sections={sections} />
      </article>
    </main>
  )
}
