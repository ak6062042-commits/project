import { useState } from 'react'
import axios from 'axios'

const COMMON_QUESTIONS = [
  { label: 'Is it damaging?', value: 'damaging' },
  { label: 'Will it look natural?', value: 'natural' },
  { label: 'How long does it last?', value: 'long' },
  { label: 'Can I wash my hair?', value: 'wash' },
  { label: 'Is it painful?', value: 'pain' },
]

export default function FAQSection() {
  const [answer, setAnswer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(null)

  async function handleQuestion(question, label) {
    setLoading(true)
    setActive(label)
    try {
      const res = await axios.post('http://localhost:8000/faq', { question })
      setAnswer(res.data.response)
    } catch {
      setAnswer('Feel free to contact us directly — our stylists are happy to help.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      marginTop: '32px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '28px',
    }}>
      <p style={{
        fontSize: '0.75rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        marginBottom: '20px'
      }}>
        Common Questions
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {COMMON_QUESTIONS.map(q => (
          <button
            key={q.value}
            onClick={() => handleQuestion(q.value, q.label)}
            style={{
              background: active === q.label ? 'var(--surface-3)' : 'var(--surface-2)',
              border: active === q.label ? '1px solid var(--gold)' : '1px solid var(--border)',
              color: active === q.label ? 'var(--gold)' : 'var(--text-muted)',
              padding: '8px 14px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              letterSpacing: '0.02em',
            }}
          >
            {q.label}
          </button>
        ))}
      </div>

      {loading && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Thinking...
        </p>
      )}

      {answer && !loading && (
        <div style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '16px 20px',
        }}>
          <p style={{ color: 'var(--text)', fontSize: '0.92rem', lineHeight: '1.6' }}>
            {answer}
          </p>
        </div>
      )}
    </div>
  )
}