import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TOKENS = ['The', 'cat', 'sat']
const TOKEN_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b']
const SCORES = [1.2, 2.8, 1.0]
const WEIGHTS = [0.18, 0.72, 0.10]

const STEPS = [
  {
    title: 'Step 1 — Every token gets three roles',
    body: 'Each word is turned into a number list (a vector). Then three separate learned transformations create three different versions of that vector: a Query, a Key, and a Value. Think of them as three different lenses on the same word.',
    visual: 'roles',
  },
  {
    title: 'Step 2 — The Query asks: "Who is relevant to me?"',
    body: 'Say we want to understand "sat". Its Query vector broadcasts a question to every other token. Each token\'s Key vector answers: "Here is how relevant I am." The match is measured as a simple dot product — multiply corresponding numbers and add them up.',
    visual: 'query',
  },
  {
    title: 'Step 3 — Dot products produce raw scores',
    body: 'The dot product of the Query with each Key gives one number per token — a raw relevance score. A higher score means that token is more relevant. Right now the scores are just raw numbers and don\'t have to add up to anything.',
    visual: 'scores',
  },
  {
    title: 'Step 4 — Softmax turns scores into percentages',
    body: 'Softmax squashes all the raw scores into a set of percentages that add up exactly to 100%. A high-scoring token gets a large percentage — the model will "pay a lot of attention" to it. A low-scoring token gets a small slice.',
    visual: 'softmax',
  },
  {
    title: 'Step 5 — Values are blended by those percentages',
    body: 'Each token\'s Value vector is multiplied by its attention percentage. Sum all those weighted Values together and you get the final output for "sat" — a blend that has absorbed information from "cat" (72%), "The" (18%), and itself (10%).',
    visual: 'output',
  },
]

export default function AttentionSteps() {
  const [step, setStep] = useState(0)
  const cur = STEPS[step]

  return (
    <div style={{ padding: '1.75rem', background: '#fff' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.4rem' }}>
          How Attention Computes — 5 Steps
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          Click through to see exactly how a transformer decides what each word should "pay attention to."
        </p>
      </div>

      {/* Progress bar pills */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.5rem' }}>
        {STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            title={STEPS[i].title}
            style={{
              flex: 1, height: 6, borderRadius: 9999, border: 'none', padding: 0,
              background: i === step ? '#2563eb' : i < step ? '#93c5fd' : '#e2e8f0',
              cursor: 'pointer', transition: 'background 0.2s',
            }}
          />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left — explanation */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.18 }}
            >
              <div style={{
                display: 'inline-block', marginBottom: '0.7rem',
                padding: '0.18rem 0.65rem', borderRadius: 9999,
                background: '#eff6ff', border: '1px solid #bfdbfe',
                fontSize: '0.7rem', fontWeight: 800, color: '#1d4ed8',
                textTransform: 'uppercase', letterSpacing: '0.07em',
              }}>
                {step + 1} / {STEPS.length}
              </div>
              <h4 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.65rem', lineHeight: 1.35 }}>
                {cur.title}
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.72, margin: 0 }}>
                {cur.body}
              </p>
            </motion.div>
          </AnimatePresence>

          <div style={{ display: 'flex', gap: '0.45rem', marginTop: '1.2rem' }}>
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              style={{
                padding: '0.42rem 1rem', borderRadius: 8,
                border: '1px solid #e2e8f0', background: '#fff',
                color: step === 0 ? '#cbd5e1' : '#475569',
                fontSize: '0.83rem', fontWeight: 600,
                cursor: step === 0 ? 'default' : 'pointer',
              }}
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
              disabled={step === STEPS.length - 1}
              style={{
                padding: '0.42rem 1rem', borderRadius: 8, border: 'none',
                background: step === STEPS.length - 1 ? '#e2e8f0' : '#2563eb',
                color: step === STEPS.length - 1 ? '#94a3b8' : '#fff',
                fontSize: '0.83rem', fontWeight: 600,
                cursor: step === STEPS.length - 1 ? 'default' : 'pointer',
              }}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Right — visual */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            style={{
              background: '#f8fafc', borderRadius: 16,
              border: '1px solid #e2e8f0', padding: '1.25rem',
              minHeight: 210,
            }}
          >
            {cur.visual === 'roles'   && <VisRoles />}
            {cur.visual === 'query'   && <VisQuery />}
            {cur.visual === 'scores'  && <VisScores />}
            {cur.visual === 'softmax' && <VisSoftmax />}
            {cur.visual === 'output'  && <VisOutput />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Visual sub-components ────────────────────────────────────────────────────

function Chip({ word, color, size = 'md' }: { word: string; color: string; size?: 'sm' | 'md' }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      padding: size === 'sm' ? '0.2rem 0.55rem' : '0.3rem 0.75rem',
      borderRadius: 8,
      background: color + '1a',
      border: `1.5px solid ${color}`,
      color, fontWeight: 700,
      fontSize: size === 'sm' ? '0.75rem' : '0.85rem',
      fontFamily: 'ui-monospace, monospace',
    }}>
      {word}
    </div>
  )
}

function RoleTag({ role }: { role: 'Q' | 'K' | 'V' }) {
  const map = { Q: ['#dbeafe', '#1d4ed8'], K: ['#dcfce7', '#15803d'], V: ['#fef9c3', '#854d0e'] }
  return (
    <div style={{
      padding: '0.18rem 0.5rem', borderRadius: 6,
      background: map[role][0], color: map[role][1],
      fontSize: '0.72rem', fontWeight: 800,
    }}>
      {role}
    </div>
  )
}

function VisRoles() {
  return (
    <div>
      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.7rem' }}>
        Each token → 3 vectors via learned projections:
      </div>
      {TOKENS.map((t, i) => (
        <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.55rem' }}>
          <Chip word={t} color={TOKEN_COLORS[i]} />
          <span style={{ color: '#cbd5e1', fontSize: '1rem' }}>→</span>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <RoleTag role="Q" />
            <RoleTag role="K" />
            <RoleTag role="V" />
          </div>
        </div>
      ))}
      <div style={{
        marginTop: '0.8rem', padding: '0.45rem 0.7rem',
        background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0',
        fontSize: '0.72rem', color: '#475569',
      }}>
        <span style={{ color: '#1d4ed8', fontWeight: 700 }}>Q</span> = "what I want" &nbsp;·&nbsp;
        <span style={{ color: '#15803d', fontWeight: 700 }}>K</span> = "what I offer" &nbsp;·&nbsp;
        <span style={{ color: '#854d0e', fontWeight: 700 }}>V</span> = "what I return"
      </div>
    </div>
  )
}

function VisQuery() {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.85rem', textAlign: 'left' }}>
        "sat" sends its Query to every Key:
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
        <Chip word="sat" color={TOKEN_COLORS[2]} />
        <span style={{ fontSize: '0.7rem', background: '#fef9c3', color: '#854d0e', padding: '0.15rem 0.4rem', borderRadius: 5, fontWeight: 700 }}>Q</span>
        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>queries all Keys →</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        {TOKENS.map((t, i) => (
          <div key={t} style={{ textAlign: 'center' }}>
            <motion.div
              animate={{ scaleY: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.2 }}
              style={{
                width: 2, height: 28, background: '#3b82f6',
                margin: '0 auto 6px', opacity: 0.5, borderRadius: 1,
              }}
            />
            <Chip word={t} color={TOKEN_COLORS[i]} size="sm" />
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: 3 }}>K</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '0.85rem', fontSize: '0.72rem', color: '#64748b' }}>
        dot product: <code style={{ background: '#eff6ff', color: '#1d4ed8', padding: '1px 5px', borderRadius: 4 }}>Q · K / √D</code> → one score per token
      </div>
    </div>
  )
}

function VisScores() {
  const max = Math.max(...SCORES)
  return (
    <div>
      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.85rem' }}>
        Raw relevance scores for "sat" attending each token:
      </div>
      {TOKENS.map((t, i) => (
        <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <Chip word={t} color={TOKEN_COLORS[i]} size="sm" />
          <div style={{ flex: 1, background: '#e2e8f0', borderRadius: 4, height: 18, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(SCORES[i] / max) * 100}%` }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              style={{ height: '100%', background: TOKEN_COLORS[i], borderRadius: 4 }}
            />
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', width: 28, textAlign: 'right' }}>
            {SCORES[i].toFixed(1)}
          </span>
        </div>
      ))}
      <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#94a3b8' }}>
        "cat" scores highest — "sat" is most related to the subject doing the sitting
      </div>
    </div>
  )
}

function VisSoftmax() {
  return (
    <div>
      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.85rem' }}>
        Softmax converts scores to percentages (always sums to 100%):
      </div>
      {TOKENS.map((t, i) => (
        <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <Chip word={t} color={TOKEN_COLORS[i]} size="sm" />
          <div style={{ flex: 1, background: '#e2e8f0', borderRadius: 4, height: 22, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${WEIGHTS[i] * 100}%` }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              style={{ height: '100%', background: TOKEN_COLORS[i], borderRadius: 4 }}
            />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: TOKEN_COLORS[i], width: 36 }}>
            {Math.round(WEIGHTS[i] * 100)}%
          </span>
        </div>
      ))}
      <div style={{
        marginTop: '0.6rem', background: '#fff', borderRadius: 8,
        padding: '0.4rem 0.7rem', border: '1px solid #e2e8f0',
        fontSize: '0.72rem', color: '#64748b',
      }}>
        18% + 72% + 10% = 100% — always, by design
      </div>
    </div>
  )
}

function VisOutput() {
  return (
    <div>
      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.85rem' }}>
        Values blended by attention weights → final output:
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '0.9rem' }}>
        {TOKENS.map((t, i) => (
          <React.Fragment key={t}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginBottom: 2, fontWeight: 700 }}>
                {Math.round(WEIGHTS[i] * 100)}%
              </div>
              <div style={{
                padding: '0.28rem 0.55rem', borderRadius: 7,
                background: TOKEN_COLORS[i] + '1a', border: `1.5px solid ${TOKEN_COLORS[i]}`,
                fontSize: '0.75rem', fontWeight: 700, color: TOKEN_COLORS[i],
                fontFamily: 'ui-monospace, monospace',
              }}>
                V({t})
              </div>
            </div>
            {i < TOKENS.length - 1 && (
              <span style={{ color: '#cbd5e1', fontSize: '1.1rem', alignSelf: 'flex-end', marginBottom: 4 }}>+</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ height: 2, flex: 1, background: '#e2e8f0', borderRadius: 1 }} />
        <div style={{
          padding: '0.4rem 1.1rem', borderRadius: 10,
          background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)',
          border: '1.5px solid #93c5fd',
          fontSize: '0.875rem', fontWeight: 800, color: '#1d4ed8',
          whiteSpace: 'nowrap',
        }}>
          output for "sat"
        </div>
        <div style={{ height: 2, flex: 1, background: '#e2e8f0', borderRadius: 1 }} />
      </div>
      <div style={{ marginTop: '0.7rem', fontSize: '0.7rem', color: '#64748b', textAlign: 'center' }}>
        Mostly "cat" (72%), some "The" (18%), little of itself (10%) — the model learns these weights
      </div>
    </div>
  )
}
