import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export const metadata: Metadata = {
  title: 'KV Cache Deep Dive — Transformer Inference and Long Context',
  description: 'A story-driven engineering guide to KV cache, attention, GPU memory, and inference optimization for modern LLMs. Learn how KV caching enables long-context generation in ChatGPT and modern language models.',
  keywords: ['KV Cache', 'Transformers', 'LLM Inference', 'GPU', 'Machine Learning', 'Deep Learning'],
  authors: [{ name: 'Engineering Guide' }],
  openGraph: {
    title: 'KV Cache Deep Dive — Transformer Inference and Long Context',
    description: 'A story-driven engineering guide to KV cache, attention, GPU memory, and inference optimization for modern LLMs.',
    type: 'article',
    url: siteUrl,
    siteName: 'KV Cache Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KV Cache Deep Dive',
    description: 'Learn how KV caching enables efficient long-context generation in modern language models.',
  },
  metadataBase: new URL(siteUrl),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="canonical" href={siteUrl} />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
