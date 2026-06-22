import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MODELS = {
  '7B':  { C: 4096, L: 32, label: 'LLaMA 7B',  desc: '32 layers · 4096 hidden' },
  '13B': { C: 5120, L: 40, label: 'LLaMA 13B', desc: '40 layers · 5120 hidden' },
  '70B': { C: 8192, L: 80, label: 'LLaMA 70B', desc: '80 layers · 8192 hidden' },
} as const

type ModelKey = keyof typeof MODELS

function humanBytes(b: number) {
  if (b === 0) return '0 B'
  const u = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.min(Math.floor(Math.log(b) / Math.log(1024)), u.length - 1)
  return `${(b / 1024 ** i).toFixed(2)} ${u[i]}`
}

const VRAM_OPTIONS = [8, 16, 24, 40, 80]

export default function KVCacheGrowth() {
  const [tokenCount, setTokenCount] = useState(0)
  const [modelKey, setModelKey] = useState<ModelKey>('7B')
  const [vramGB, setVramGB] = useState(24)

  const { C, L } = MODELS[modelKey]
  const bytesPerToken = 2 * C * 2 * L   // K+V, fp16, all layers

  const totalBytes = tokenCount * bytesPerToken
  const vramBytes  = vramGB * 1024 ** 3
  const pct        = Math.min(100, (totalBytes / vramBytes) * 100)
  const maxTokens  = Math.floor(vramBytes / bytesPerToken)

  const barColor   = pct < 50 ? '#22c55e' : pct < 80 ? '#f59e0b' : '#ef4444'
  const statusText = pct < 50 ? '✓ Healthy' : pct < 80 ? '⚠ Getting full' : '✗ Critical!'
  const statusBg   = pct < 50 ? '#f0fdf4'  : pct < 80 ? '#fffbeb'  : '#fef2f2'

  const add    = (n: number) => setTokenCount(t => Math.min(t + n, 999999))
  const reset  = ()          => setTokenCount(0)

  const displayTokens = useMemo(
    () => Array.from({ length: Math.min(tokenCount, 12) }, (_, i) => i),
    [tokenCount]
  )
  const extra = Math.max(0, tokenCount - 12)

  return (
    <div style={{ padding: '1.75rem', background: '#fff' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          KV Cache VRAM Simulator
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.4rem 0 0' }}>
          Every token you generate adds K and V vectors to the cache — one per transformer layer.
          Watch GPU memory fill up as the sequence grows.
        </p>
      </div>

      {/* Model selector */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          Model
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(Object.keys(MODELS) as ModelKey[]).map(k => (
            <button
              key={k}
              onClick={() => setModelKey(k)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 10,
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                background: modelKey === k ? '#2563eb' : '#f1f5f9',
                color: modelKey === k ? '#fff' : '#475569',
                transition: 'all 0.15s',
              }}
            >
              {MODELS[k].label}
              <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 400, opacity: 0.8 }}>
                {MODELS[k].desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* VRAM selector */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          GPU VRAM
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {VRAM_OPTIONS.map(v => (
            <button
              key={v}
              onClick={() => setVramGB(v)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 8,
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1.5px solid',
                borderColor: vramGB === v ? '#2563eb' : '#e2e8f0',
                background: vramGB === v ? '#eff6ff' : '#fff',
                color: vramGB === v ? '#1d4ed8' : '#64748b',
                transition: 'all 0.12s',
              }}
            >
              {v} GB
            </button>
          ))}
        </div>
      </div>

      {/* 3-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', gap: '1.25rem', alignItems: 'start' }}>

        {/* Token stream */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
            Token Stream
          </div>
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            padding: '0.75rem',
            minHeight: 180,
            overflow: 'hidden',
          }}>
            <AnimatePresence initial={false}>
              {displayTokens.map(i => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    marginBottom: '0.35rem',
                    padding: '0.3rem 0.6rem',
                    background: '#fff',
                    borderRadius: 7,
                    border: '1px solid #e2e8f0',
                    fontSize: '0.75rem',
                    fontFamily: 'ui-monospace, monospace',
                    color: '#334155',
                  }}
                >
                  token_{i + 1}
                </motion.div>
              ))}
            </AnimatePresence>
            {extra > 0 && (
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', marginTop: 4 }}>
                + {extra.toLocaleString()} more
              </div>
            )}
            {tokenCount === 0 && (
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', textAlign: 'center', marginTop: 40 }}>
                Press Generate to start
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
            {[1, 100, 1000].map(n => (
              <button
                key={n}
                onClick={() => add(n)}
                style={{
                  flex: 1,
                  padding: '0.4rem 0',
                  borderRadius: 8,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  background: n === 1 ? '#2563eb' : n === 100 ? '#4f46e5' : '#7c3aed',
                  color: '#fff',
                }}
              >
                +{n.toLocaleString()}
              </button>
            ))}
            <button
              onClick={reset}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: 8,
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid #e2e8f0',
                background: '#fff',
                color: '#64748b',
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* VRAM bar */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem', textAlign: 'center' }}>
            VRAM
          </div>
          <div style={{
            height: 180,
            background: '#f1f5f9',
            borderRadius: 12,
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid #e2e8f0',
          }}>
            <motion.div
              animate={{ height: `${pct}%`, backgroundColor: barColor }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderRadius: '0 0 10px 10px' }}
            />
            {pct > 8 && (
              <div style={{
                position: 'absolute',
                bottom: 6,
                left: 0, right: 0,
                textAlign: 'center',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#fff',
              }}>
                {pct.toFixed(1)}%
              </div>
            )}
          </div>
          <div style={{
            marginTop: '0.4rem',
            padding: '0.3rem 0.5rem',
            borderRadius: 8,
            background: statusBg,
            textAlign: 'center',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: barColor,
          }}>
            {statusText}
          </div>
        </div>

        {/* Stats */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
            Memory Stats
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { label: 'Tokens in cache',   value: tokenCount.toLocaleString() },
              { label: 'KV cache total',    value: humanBytes(totalBytes) },
              { label: 'Per-token cost',    value: humanBytes(bytesPerToken) },
              { label: 'VRAM used',         value: `${pct.toFixed(2)}%` },
              { label: 'Layers × hidden',   value: `${L} × ${C}` },
            ].map(({ label, value }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: '#f8fafc', borderRadius: 8, padding: '0.4rem 0.75rem',
                border: '1px solid #f1f5f9',
              }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{label}</span>
                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a' }}>{value}</span>
              </div>
            ))}
          </div>

          {tokenCount > 0 && (
            <div style={{
              marginTop: '0.75rem',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 10,
              padding: '0.6rem 0.75rem',
              fontSize: '0.78rem',
              color: '#1d4ed8',
              lineHeight: 1.5,
            }}>
              Cache runs out around <strong>{maxTokens.toLocaleString()}</strong> tokens on this GPU.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
