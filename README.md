# KV Cache Blog — Production Deployment

A story-driven engineering article on KV caching for transformer inference, built with Next.js, Tailwind CSS, and interactive React visualizations. Designed for deployment on Vercel.

## Project Structure

```
kv-cache-blog/
├── app/                    # Next.js app directory (SSG/SSR pages)
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main article page
│   ├── demo/page.tsx       # Interactive visualizations
│   ├── sitemap.ts          # SEO sitemap
│   └── robots.ts           # SEO robots.txt
├── components/             # Reusable React components
│   ├── MarkdownContent.tsx # Markdown renderer
│   └── DemoNav.tsx         # Navigation
├── content/                # Static content
│   └── final-blog.ts       # Article markdown loader
├── lib/                    # Utilities
│   └── renderMarkdown.ts   # Markdown to HTML converter
├── styles/                 # CSS (Tailwind)
│   └── globals.css
├── public/                 # Static assets
│   ├── robots.txt
│   └── favicon.svg
├── visualizations/         # Interactive demo (Vite sandbox)
│   └── demo/
├── article/                # Original chapter files
├── benchmarks/             # Benchmark scripts
├── final-blog.md           # Assembled article (published content)
└── next.config.mjs         # Next.js configuration
```

## Key Features

- **Story-driven narrative** on KV caching for transformers
- **Full 12-chapter article** with engineering depth
- **Interactive visualizations** (Attention Heatmap, Prefill vs Decode, KV Cache Growth)
- **Production-ready styling** with Tailwind CSS
- **SEO optimized** (metadata, sitemap, robots.txt, OG tags)
- **Vercel deployment ready** (vercel.json included)
- **TypeScript** for type safety
- **Markdown rendering** with code blocks and formatting

## Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

### Option 1: Use Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option 2: GitHub + Vercel Dashboard

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/kv-cache-blog.git
   git push -u origin main
   ```

2. Connect to Vercel:
   - Go to [vercel.com/import](https://vercel.com/import)
   - Select your GitHub repository
   - Vercel auto-detects Next.js and deploys

### Configuration

Update `app/layout.tsx` and `app/sitemap.ts` with your production URL:

```typescript
metadataBase: new URL('https://your-domain.com')
```

## Publishing Workflows

### Hashnode Publishing

1. Copy `final-blog.md` into Hashnode editor
2. Add interactive demo link (e.g., hosted on Vercel)
3. Include cover image and metadata
4. Publish with tags: `LLM`, `Transformers`, `GPU`, `Inference`, `Visualization`

### Dev.to Cross-Post

1. Use Hashnode canonical link in Dev.to
2. Link to full post on original site

## Content Structure

- **Chapters 1–12**: Story-driven engineering narrative
  - Intuition-first explanations
  - Tensor shapes and dimensions
  - GPU memory interpretation
  - Complexity analysis
  
- **Appendices**:
  - Profiling & benchmarks (Nsight commands)
  - FlashAttention runnable example
  - KV cache memory layout formulas
  - Numeric tensor walkthroughs

## Interactive Demos

Live at `/demo` route:

- **Attention Heatmap**: Visualize attention weights from token queries to keys
- **Prefill vs Decode**: Compare O(N²) naive vs O(N) with KV cache
- **KV Cache Growth**: Interactive simulator for memory usage by sequence length

## SEO & Performance

- Metadata and Open Graph tags ✓
- Sitemap and robots.txt ✓
- Image optimization ready
- Code splitting and lazy loading ready
- Mobile responsive ✓

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Build & Lint

```bash
npm run lint
npm run build
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- Accessibility features (semantic HTML, ARIA labels)

## License

Educational content — free to share and adapt with attribution.

## Next Steps

1. Update production domain in metadata
2. Deploy to Vercel
3. Monitor Core Web Vitals
4. Gather feedback and iterate
