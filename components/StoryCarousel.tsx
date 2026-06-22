'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// deterministic "random" to avoid hydration mismatches
function d(i: number, j = 0) { return ((i * 13 + j * 7 + 17) % 10) / 10 }

// ── Slide 1: Latency grows with conversation length ───────────────────────────
function SlideSpeed() {
  const rows = [
    { label: '5 messages',   pct: 8,   time: '0.4s',  col: '#22c55e', status: 'Fast' },
    { label: '30 messages',  pct: 38,  time: '2.1s',  col: '#f59e0b', status: 'Slowing' },
    { label: '100 messages', pct: 100, time: '8.7s',  col: '#ef4444', status: 'Very slow' },
  ]
  return (
    <div style={{ width: '100%' }}>
      <div style={{ fontSize: '0.7rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '1.1rem' }}>
        Average response time per token ↓
      </div>
      {rows.map((r, i) => (
        <div key={r.label} style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{r.label}</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: r.col }}>{r.time}</span>
          </div>
          <div style={{ height: 38, background: '#1e293b', borderRadius: 9, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: r.pct + '%' }}
              transition={{ duration: 0.7, delay: i * 0.2, ease: 'easeOut' }}
              style={{ height: '100%', background: r.col, borderRadius: 9, display: 'flex', alignItems: 'center', paddingLeft: 12 }}
            >
              <span style={{ fontSize: '0.72rem', color: '#fff', fontWeight: 700, whiteSpace: 'nowrap' }}>{r.status}</span>
            </motion.div>
          </div>
        </div>
      ))}
      <div style={{ marginTop: '0.6rem', fontSize: '0.72rem', color: '#475569', fontStyle: 'italic' }}>
        Same model · same GPU · only conversation length differs
      </div>
    </div>
  )
}

// ── Slide 2: Text → tokens → vectors ─────────────────────────────────────────
function SlideTokens() {
  const tokens = ['KV', 'cache', 'powers', 'ChatGPT']
  const colors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#22c55e']
  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem', fontFamily: 'monospace' }}>
        "KV cache powers ChatGPT"
      </div>
      <div style={{ fontSize: '0.65rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
        Split into tokens ↓
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.55rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tokens.map((t, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.18, duration: 0.3 }}
            style={{
              padding: '0.45rem 0.9rem', borderRadius: 10,
              background: colors[i] + '22', border: `2px solid ${colors[i]}`,
              color: colors[i], fontWeight: 800, fontSize: '1rem', fontFamily: 'monospace',
            }}
          >
            {t}
          </motion.div>
        ))}
      </div>
      <div style={{ fontSize: '0.65rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
        Each token → a vector of 4,096 numbers
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
        {tokens.map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Array.from({ length: 10 }, (_, j) => (
              <div key={j} style={{ width: 7, height: 7, borderRadius: 2, background: colors[i], opacity: 0.2 + d(i, j) * 0.8 }} />
            ))}
            <div style={{ fontSize: '0.55rem', color: '#475569', textAlign: 'center', marginTop: 2 }}>…</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Slide 3: Attention = N² pairs ────────────────────────────────────────────
function SlideAttention() {
  const [n, setN] = useState(4)
  const pairs = n * n
  const benchmarks = [[10, '100'], [100, '10,000'], [1000, '1,000,000']]
  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <div style={{ display: 'inline-block', marginBottom: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 1fr)`, gap: 4 }}>
          {Array.from({ length: n * n }, (_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.4 + d(i) * 0.6 }}
              transition={{ delay: i * 0.015, duration: 0.15 }}
              style={{ width: 26, height: 26, borderRadius: 5, background: '#3b82f6' }}
            />
          ))}
        </div>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <span style={{ fontSize: '2.75rem', fontWeight: 900, color: '#3b82f6', lineHeight: 1 }}>
          {pairs.toLocaleString()}
        </span>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>attention pairs computed</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>N =</span>
        <input type="range" min={2} max={8} value={n} onChange={e => setN(Number(e.target.value))}
          style={{ accentColor: '#3b82f6', width: 130 }} />
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9', minWidth: 16 }}>{n}</span>
      </div>
      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {benchmarks.map(([n, p]) => (
          <div key={n} style={{ padding: '0.28rem 0.65rem', background: '#1e293b', borderRadius: 7, fontSize: '0.72rem', color: '#94a3b8' }}>
            N={n} → <strong style={{ color: '#ef4444' }}>{p}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Slide 4: Recomputation waste ──────────────────────────────────────────────
function SlideWaste() {
  const steps = [
    { tok: 't₁', waste: [],                           fresh: ['K₁','V₁'] },
    { tok: 't₂', waste: ['K₁','V₁'],                 fresh: ['K₂','V₂'] },
    { tok: 't₃', waste: ['K₁','V₁','K₂','V₂'],       fresh: ['K₃','V₃'] },
    { tok: 't₄', waste: ['K₁','V₁','K₂','V₂','K₃','V₃'], fresh: ['K₄','V₄'] },
  ]
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.85rem' }}>
        <span><span style={{ color: '#ef4444' }}>■</span> Wasted (recomputed)</span>
        <span><span style={{ color: '#22c55e' }}>■</span> New work</span>
      </div>
      {steps.map((s, i) => (
        <motion.div key={s.tok} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.18 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.55rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', color: '#475569', width: 22, flexShrink: 0, fontFamily: 'monospace' }}>{s.tok}</span>
          {s.waste.map(w => (
            <div key={w} style={{ padding: '0.12rem 0.38rem', background: '#ef444425', border: '1px solid #ef4444', borderRadius: 5, fontSize: '0.63rem', color: '#ef4444', fontFamily: 'monospace' }}>{w}</div>
          ))}
          {s.fresh.map(f => (
            <div key={f} style={{ padding: '0.12rem 0.38rem', background: '#22c55e25', border: '1px solid #22c55e', borderRadius: 5, fontSize: '0.63rem', color: '#22c55e', fontFamily: 'monospace' }}>{f}</div>
          ))}
        </motion.div>
      ))}
      <div style={{ marginTop: '0.85rem', padding: '0.55rem 0.85rem', background: '#ef444412', border: '1px solid #ef444435', borderRadius: 10, fontSize: '0.78rem', color: '#fca5a5' }}>
        At token #100 → <strong>99 needless recomputations</strong> every single step
      </div>
    </div>
  )
}

// ── Slide 5: KV Cache fixes it ────────────────────────────────────────────────
function SlideCache() {
  const kvs = ['K₁V₁','K₂V₂','K₃V₃','K₄V₄']
  return (
    <div style={{ width: '100%' }}>
      {/* Without */}
      <div style={{ marginBottom: '0.85rem', padding: '0.75rem', background: '#ef444410', border: '1px solid #ef444430', borderRadius: 12 }}>
        <div style={{ fontSize: '0.68rem', color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>✗ Without cache</div>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {kvs.map(k => (
            <div key={k} style={{ padding: '0.22rem 0.48rem', background: '#ef444420', border: '1px solid #ef4444', borderRadius: 6, fontSize: '0.65rem', color: '#ef4444', fontFamily: 'monospace' }}>{k} ↺</div>
          ))}
          <span style={{ fontSize: '0.68rem', color: '#64748b', alignSelf: 'center' }}>recomputed every step</span>
        </div>
      </div>

      {/* With cache */}
      <div style={{ padding: '0.85rem', background: '#22c55e10', border: '1.5px solid #22c55e40', borderRadius: 12 }}>
        <div style={{ fontSize: '0.68rem', color: '#22c55e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>✓ With KV Cache</div>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
          {kvs.map(k => (
            <div key={k} style={{ padding: '0.22rem 0.48rem', background: '#22c55e20', border: '1px solid #22c55e', borderRadius: 6, fontSize: '0.65rem', color: '#22c55e', fontFamily: 'monospace' }}>{k} ✓</div>
          ))}
        </div>
        <motion.div animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}
          style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
          New token → compute K₅V₅ → append → done ✓
        </motion.div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem' }}>
        {[['Compute saved', 'N−1 per step', '#22c55e'], ['Extra cost', '~1 MB / token', '#f59e0b']].map(([l, v, c]) => (
          <div key={l} style={{ flex: 1, padding: '0.5rem', background: '#1e293b', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: '#475569', marginBottom: 2 }}>{l}</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: c }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Slide 6: The numbers ──────────────────────────────────────────────────────
function SlideNumbers() {
  const [n, setN] = useState(100)
  const withoutOps = n * n
  const withOps = n
  const saved = n > 1 ? Math.round((1 - withOps / withoutOps) * 100) : 0
  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Without cache', val: withoutOps, col: '#ef4444', bg: '#ef444412', border: '#ef444435' },
          { label: 'With KV Cache', val: withOps,    col: '#22c55e', bg: '#22c55e12', border: '#22c55e35' },
        ].map(({ label, val, col, bg, border }) => (
          <div key={label} style={{ flex: 1, padding: '0.85rem 0.5rem', background: bg, border: `1px solid ${border}`, borderRadius: 14 }}>
            <div style={{ fontSize: '0.65rem', color: col, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>{label}</div>
            <motion.div key={val} initial={{ scale: 0.85 }} animate={{ scale: 1 }}
              style={{ fontSize: '1.6rem', fontWeight: 900, color: col, lineHeight: 1 }}>
              {val.toLocaleString()}
            </motion.div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 4 }}>attention ops</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: '1.1rem' }}>
        <div style={{ fontSize: '3rem', fontWeight: 900, color: '#3b82f6', lineHeight: 1 }}>{saved}%</div>
        <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>fewer operations</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>N =</span>
        <input type="range" min={10} max={2000} value={n} onChange={e => setN(Number(e.target.value))}
          style={{ accentColor: '#3b82f6', flex: 1, maxWidth: 180 }} />
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9', minWidth: 52, textAlign: 'right' }}>{n.toLocaleString()}</span>
      </div>
    </div>
  )
}

// ── Slide 7: Memory cost ──────────────────────────────────────────────────────
function SlideMemory() {
  const [tokens, setTokens] = useState(512)
  const VRAM = 24
  const models = [
    { name: '7B',  mbPerTok: 0.5,  col: '#3b82f6' },
    { name: '13B', mbPerTok: 1.0,  col: '#8b5cf6' },
    { name: '70B', mbPerTok: 4.0,  col: '#ef4444' },
  ]
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem' }}>
        {models.map(m => {
          const usedGB = (tokens * m.mbPerTok) / 1024
          const pct = Math.min(100, (usedGB / VRAM) * 100)
          const danger = pct > 80
          return (
            <div key={m.name} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.4rem' }}>{m.name}</div>
              <div style={{ height: 130, background: '#1e293b', borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
                <motion.div
                  animate={{ height: pct + '%' }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: danger ? '#ef4444' : m.col, borderRadius: '0 0 8px 8px' }}
                />
                {pct > 12 && (
                  <div style={{ position: 'absolute', bottom: 6, left: 0, right: 0, textAlign: 'center', fontSize: '0.7rem', fontWeight: 800, color: '#fff', zIndex: 1 }}>
                    {pct.toFixed(0)}%
                  </div>
                )}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.35rem' }}>{usedGB.toFixed(1)} GB</div>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Tokens cached:</span>
        <input type="range" min={64} max={4096} value={tokens} step={64} onChange={e => setTokens(Number(e.target.value))}
          style={{ accentColor: '#3b82f6', flex: 1 }} />
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9', minWidth: 48 }}>{tokens.toLocaleString()}</span>
      </div>
      <div style={{ padding: '0.5rem 0.75rem', background: '#1e293b', borderRadius: 8, fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center' }}>
        On a 24 GB GPU · red = danger zone · KV cache trades compute for memory
      </div>
    </div>
  )
}

// ── Slide registry ────────────────────────────────────────────────────────────

const SLIDES = [
  { num: '01', title: 'Why does ChatGPT slow down?',         caption: 'The longer your conversation, the slower each response. Not a server problem — a math problem baked into how transformers work.', Visual: SlideSpeed },
  { num: '02', title: 'Text → tokens → vectors',             caption: 'Every word is broken into tokens. Each token becomes a high-dimensional vector. The model never reads letters — only numbers.', Visual: SlideTokens },
  { num: '03', title: 'Attention grows at N²',               caption: 'To understand each token, the model scores it against every other token. Double the tokens, quadruple the work. Drag the slider.', Visual: SlideAttention },
  { num: '04', title: 'Without cache: pure waste',           caption: 'Generating token #100 means recomputing 99 vectors from scratch. Every. Single. Step. The red blocks are wasted GPU cycles.', Visual: SlideWaste },
  { num: '05', title: 'KV Cache: compute once, reuse',       caption: 'Store the Key and Value vectors once. Every future query reads from cache. One generation step now costs O(N) instead of O(N²).', Visual: SlideCache },
  { num: '06', title: 'The math is brutal without it',       caption: 'At 1,000 tokens: 1,000,000 ops without cache vs 1,000 with. Drag the slider — the gap widens fast.', Visual: SlideNumbers },
  { num: '07', title: 'The catch: it eats GPU memory',       caption: 'Each cached token occupies GPU RAM. A 70B model needs ~4 MB per token. At 4,096 tokens that is 16 GB — just for the cache.', Visual: SlideMemory },
]

// ── Main carousel ─────────────────────────────────────────────────────────────

export default function StoryCarousel() {
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(1)
  const total = SLIDES.length

  function go(to: number) {
    setDir(to > idx ? 1 : -1)
    setIdx(to)
  }
  function next() { go((idx + 1) % total) }
  function prev() { go((idx - 1 + total) % total) }

  const { num, title, caption, Visual } = SLIDES[idx]

  return (
    <div style={{ background: '#0f172a', borderRadius: 22, overflow: 'hidden', marginBottom: '2.5rem', border: '1px solid #1e293b' }}>

      {/* Top progress strip */}
      <div style={{ display: 'flex', height: 3 }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => go(i)} style={{ flex: 1, height: '100%', border: 'none', cursor: 'pointer', padding: 0, background: i <= idx ? '#3b82f6' : '#1e293b', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* Body */}
      <div className="carousel-body">
        {/* Left — text pane */}
        <div className="carousel-text-pane">
          <div>
            <div style={{ fontSize: '4.5rem', fontWeight: 900, color: '#1e293b', lineHeight: 1, marginBottom: '1.25rem', userSelect: 'none', fontVariantNumeric: 'tabular-nums' }}>
              {num}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f1f5f9', margin: '0 0 0.85rem', lineHeight: 1.3 }}>
                  {title}
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>
                  {caption}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button onClick={prev} style={{ padding: '0.5rem 0.9rem', borderRadius: 8, border: '1px solid #334155', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                ←
              </button>
              <button onClick={next} style={{ padding: '0.5rem 1.1rem', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>
                {idx < total - 1 ? 'Next →' : 'Start over ↺'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {SLIDES.map((_, i) => (
                <button key={i} onClick={() => go(i)} style={{ width: i === idx ? 22 : 8, height: 8, borderRadius: 9999, border: 'none', padding: 0, cursor: 'pointer', background: i === idx ? '#3b82f6' : '#334155', transition: 'all 0.25s' }} />
              ))}
            </div>
          </div>
        </div>

        {/* Right — visual pane */}
        <div className="carousel-visual-pane">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={idx}
              custom={dir}
              initial={{ opacity: 0, x: dir * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -28 }}
              transition={{ duration: 0.22 }}
              style={{ width: '100%' }}
            >
              <Visual />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
