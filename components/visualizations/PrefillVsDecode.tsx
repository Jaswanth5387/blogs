import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MAX_DISPLAY = 8  // max grid side length for visual display

export default function PrefillVsDecode() {
  const [n, setN] = useState(6)

  const withoutOps = n * n
  const withOps = n
  const savedPct = n > 1 ? Math.round((1 - withOps / withoutOps) * 100) : 0

  // Grid display: cap at MAX_DISPLAY × MAX_DISPLAY for rendering
  const displayN = Math.min(n, MAX_DISPLAY)
  const withoutCells = displayN * displayN
  const withCells = displayN

  // Complexity chart points (SVG viewBox 0 0 100 100)
  const chartPoints = useMemo(() => {
    const pts = Array.from({ length: n }, (_, i) => i + 1)
    const maxN2 = n * n
    const ptsN2 = pts.map((x, i) => `${(i / Math.max(n - 1, 1)) * 96 + 2},${98 - (x * x / maxN2) * 90}`)
    const ptsN  = pts.map((x, i) => `${(i / Math.max(n - 1, 1)) * 96 + 2},${98 - (x / n) * 90}`)
    return { ptsN2: ptsN2.join(' '), ptsN: ptsN.join(' ') }
  }, [n])

  return (
    <div style={{ padding: '1.75rem', background: '#fff' }}>
      {/* Header */}
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          Compute Cost: With vs Without KV Cache
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.4rem 0 0' }}>
          Each square below = one attention operation. Without a KV cache, operations grow as N² (every token re-reads every token). With a KV cache, only N operations are needed — one per cached token.
        </p>
      </div>

      {/* Slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.875rem', color: '#475569', fontWeight: 500, whiteSpace: 'nowrap' }}>
          Tokens generated:
        </span>
        <input
          type="range" min={1} max={20} value={n}
          onChange={e => setN(Number(e.target.value))}
          style={{ flex: 1, accentColor: '#2563eb' }}
        />
        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb', width: 36 }}>{n}</span>
      </div>

      {/* Side-by-side grid comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Without cache */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.25rem 0.75rem', borderRadius: 9999,
              background: '#fef2f2', color: '#b91c1c',
              fontSize: '0.75rem', fontWeight: 700,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
              Without KV Cache
            </span>
            <motion.div
              key={withoutOps}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              style={{ fontSize: '2.5rem', fontWeight: 900, color: '#dc2626', lineHeight: 1, margin: '0.5rem 0 0' }}
            >
              {withoutOps.toLocaleString()}
            </motion.div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              operations <strong style={{ color: '#dc2626' }}>O(N²)</strong>
            </div>
          </div>

          {/* N×N grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${displayN}, 1fr)`,
            gap: 3,
            maxWidth: 200,
            margin: '0 auto',
          }}>
            <AnimatePresence>
              {Array.from({ length: withoutCells }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.006, 0.4), duration: 0.18 }}
                  style={{
                    aspectRatio: '1',
                    background: `hsl(${0 + (i / withoutCells) * 20}, 80%, ${55 + (i / withoutCells) * 10}%)`,
                    borderRadius: 3,
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
          {n > MAX_DISPLAY && (
            <div style={{ textAlign: 'center', marginTop: 6, fontSize: '0.7rem', color: '#94a3b8', fontStyle: 'italic' }}>
              showing {displayN}×{displayN} of actual {n}×{n}
            </div>
          )}
        </div>

        {/* With cache */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.25rem 0.75rem', borderRadius: 9999,
              background: '#f0fdf4', color: '#15803d',
              fontSize: '0.75rem', fontWeight: 700,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              With KV Cache
            </span>
            <motion.div
              key={withOps}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              style={{ fontSize: '2.5rem', fontWeight: 900, color: '#16a34a', lineHeight: 1, margin: '0.5rem 0 0' }}
            >
              {withOps.toLocaleString()}
            </motion.div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              operations <strong style={{ color: '#16a34a' }}>O(N)</strong>
            </div>
          </div>

          {/* Single column of N cells */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            maxWidth: 48,
            margin: '0 auto',
          }}>
            <AnimatePresence>
              {Array.from({ length: withCells }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  style={{ height: 22, background: '#22c55e', borderRadius: 4 }}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Savings banner */}
      <motion.div
        key={`${n}-savings`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)',
          border: '1px solid #bfdbfe',
          borderRadius: 18,
          padding: '1rem 1.5rem',
          textAlign: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ fontSize: '2.75rem', fontWeight: 900, color: '#1d4ed8', lineHeight: 1 }}>
          {savedPct}%
        </div>
        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#2563eb', marginTop: 2 }}>
          fewer operations with KV Cache
        </div>
        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>
          {withoutOps.toLocaleString()} → {withOps.toLocaleString()} operations at N = {n}
        </div>
      </motion.div>

      {/* Complexity chart */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          Growth curve (as N increases)
        </div>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: 100, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', display: 'block' }}>
          <polyline points={chartPoints.ptsN2} fill="none" stroke="#ef4444" strokeWidth={1.2} />
          <polyline points={chartPoints.ptsN}  fill="none" stroke="#22c55e" strokeWidth={1.2} />
          <text x={4} y={12} fontSize={6} fill="#ef4444" fontWeight="bold">O(N²) — without cache</text>
          <text x={4} y={22} fontSize={6} fill="#16a34a" fontWeight="bold">O(N)  — with KV cache</text>
        </svg>
      </div>
    </div>
  )
}
