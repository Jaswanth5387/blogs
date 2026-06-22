import React, { useMemo, useState, useEffect } from 'react'
import * as d3 from 'd3'

const DH = 32

function softmax(arr: number[]) {
  const max = Math.max(...arr)
  const exps = arr.map(v => Math.exp(v - max))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map(e => e / sum)
}

function seededRandom(seed: number) {
  return function () {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

function makeProj(seed: number) {
  const rand = seededRandom(seed)
  return Array.from({ length: DH }, () =>
    Array.from({ length: DH }, () => (rand() - 0.5) * 0.8)
  )
}

function matMul(M: number[][], v: number[]) {
  return M.map(row => row.reduce((s, val, i) => s + val * v[i], 0))
}

const PROJ_Q = makeProj(1337)
const PROJ_K = makeProj(4242)

const PRESETS = [
  'France is the capital',
  'the cat sat on mat',
  'KV cache saves memory',
  'attention is all you need',
]

export default function AttentionHeatmap() {
  const [sentence, setSentence] = useState(PRESETS[0])
  const [hovered, setHovered] = useState<{ r: number; c: number } | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120)
    return () => clearTimeout(t)
  }, [sentence])

  const tokens = useMemo(
    () => sentence.trim().split(/\s+/).filter(Boolean).slice(0, 9),
    [sentence]
  )

  const matrix = useMemo(() => {
    const n = tokens.length
    if (n === 0) return [[1]]
    const embeddings = tokens.map(t => {
      const sum = Array.from(t).reduce((s, ch) => s + ch.charCodeAt(0), 0)
      return Array.from({ length: DH }, (_, i) => Math.sin((sum + i) * 0.13))
    })
    const Q = embeddings.map(e => matMul(PROJ_Q, e))
    const K = embeddings.map(e => matMul(PROJ_K, e))
    return Q.map(q => {
      const scores = K.map(k => q.reduce((s, v, i) => s + v * k[i], 0) / Math.sqrt(DH))
      return softmax(scores)
    })
  }, [tokens])

  const colorFn = d3.scaleSequential(d3.interpolateBlues).domain([0, 1])

  const n = tokens.length
  const CELL = Math.min(54, Math.floor(300 / Math.max(n, 1)))
  const PAD_L = 68
  const PAD_T = 52
  const W = PAD_L + n * CELL + 8
  const H = PAD_T + n * CELL + 8

  const flat = matrix.flat()
  const maxVal = flat.length ? Math.max(...flat) : 1
  let peakR = 0, peakC = 0
  matrix.forEach((row, r) =>
    row.forEach((v, c) => { if (v === maxVal) { peakR = r; peakC = c } })
  )

  const infoText = hovered
    ? `"${tokens[hovered.c]}" → "${tokens[hovered.r]}" — ${((matrix[hovered.r]?.[hovered.c] ?? 0) * 100).toFixed(1)}% attention`
    : 'Hover any cell to inspect the attention weight between two tokens'

  function handlePreset(p: string) {
    setVisible(false)
    setSentence(p)
  }

  return (
    <div style={{ padding: '1.75rem', background: '#fff' }}>
      {/* Header */}
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          Attention Heatmap
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.4rem 0 0' }}>
          Each cell shows how much one token "looks at" another when computing attention.
          Darker blue = stronger attention. The <em>top labels</em> are the tokens being attended <em>to</em>;
          the <em>left labels</em> are the tokens doing the attending.
        </p>
      </div>

      {/* Preset pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {PRESETS.map(p => (
          <button
            key={p}
            onClick={() => handlePreset(p)}
            style={{
              padding: '0.3rem 0.85rem',
              borderRadius: 9999,
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: sentence === p ? 'none' : '1px solid #e2e8f0',
              background: sentence === p ? '#2563eb' : '#f8fafc',
              color: sentence === p ? '#fff' : '#475569',
              transition: 'all 0.15s',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Custom input */}
      <input
        value={sentence}
        onChange={e => { setVisible(false); setSentence(e.target.value) }}
        placeholder="Or type your own phrase (max 9 words)…"
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          border: '1px solid #e2e8f0',
          borderRadius: 10,
          fontSize: '0.9rem',
          marginBottom: '1.25rem',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

      {/* Main content */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start', minWidth: 0 }}>
        {/* Heatmap SVG */}
        <div style={{ overflowX: 'auto', flexShrink: 0 }}>
          <svg width={W} height={H} style={{ display: 'block' }}>
            <g transform={`translate(${PAD_L},${PAD_T})`}>
              {matrix.map((row, r) =>
                row.map((val, c) => {
                  const isExact = hovered?.r === r && hovered?.c === c
                  const isLine = hovered && (hovered.r === r || hovered.c === c)
                  const isPeak = r === peakR && c === peakC
                  return (
                    <g key={`${r}-${c}`}>
                      <rect
                        x={c * CELL + 2}
                        y={r * CELL + 2}
                        width={CELL - 4}
                        height={CELL - 4}
                        rx={6}
                        fill={colorFn(val)}
                        stroke={isExact ? '#f59e0b' : isLine ? '#93c5fd' : 'none'}
                        strokeWidth={isExact ? 2.5 : 1.5}
                        style={{
                          opacity: visible ? 1 : 0,
                          transition: `opacity ${0.2 + (r + c) * 0.025}s ease`,
                          cursor: 'crosshair',
                        }}
                        onMouseEnter={() => setHovered({ r, c })}
                        onMouseLeave={() => setHovered(null)}
                      />
                      {isPeak && (
                        <circle
                          cx={c * CELL + CELL / 2}
                          cy={r * CELL + CELL / 2}
                          r={3.5}
                          fill="rgba(255,255,255,0.92)"
                          style={{ pointerEvents: 'none' }}
                        />
                      )}
                    </g>
                  )
                })
              )}
              {/* Column labels (top) */}
              {tokens.map((t, i) => (
                <text
                  key={`col-${i}`}
                  x={i * CELL + CELL / 2}
                  y={-12}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={hovered?.c === i ? 700 : 400}
                  fill={hovered?.c === i ? '#1d4ed8' : '#94a3b8'}
                >
                  {t.length > 7 ? t.slice(0, 6) + '…' : t}
                </text>
              ))}
              {/* Row labels (left) */}
              {tokens.map((t, i) => (
                <text
                  key={`row-${i}`}
                  x={-10}
                  y={i * CELL + CELL / 2 + 4}
                  textAnchor="end"
                  fontSize={11}
                  fontWeight={hovered?.r === i ? 700 : 400}
                  fill={hovered?.r === i ? '#1d4ed8' : '#94a3b8'}
                >
                  {t.length > 7 ? t.slice(0, 6) + '…' : t}
                </text>
              ))}
            </g>
          </svg>
        </div>

        {/* Side info panel */}
        <div style={{ flex: 1, minWidth: 180 }}>
          {/* Hover info */}
          <div style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 12,
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            color: '#1e40af',
            minHeight: 52,
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem',
            lineHeight: 1.5,
          }}>
            {infoText}
          </div>

          {/* Legend */}
          <div style={{ marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Attention Strength
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Low</span>
            <div style={{
              flex: 1, height: 10, borderRadius: 5,
              background: 'linear-gradient(to right, #dbeafe, #1e3a8a)',
            }} />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>High</span>
          </div>

          {/* Stats */}
          <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.8 }}>
            <div><strong style={{ color: '#0f172a' }}>{n}</strong> tokens → <strong style={{ color: '#0f172a' }}>{n * n}</strong> attention pairs computed</div>
            {n > 0 && (
              <div>
                Peak: <strong style={{ color: '#0f172a' }}>"{tokens[peakC]}"</strong> → <strong style={{ color: '#0f172a' }}>"{tokens[peakR]}"</strong> ({(maxVal * 100).toFixed(1)}%)
              </div>
            )}
            <div style={{ marginTop: '0.5rem', color: '#94a3b8', fontSize: '0.75rem' }}>
              ● white dot marks the single strongest attention weight
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
