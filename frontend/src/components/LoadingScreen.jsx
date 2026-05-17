import { useState, useEffect } from 'react'

const MESSAGES = [
  'Analysing your hair profile...',
  'Calculating the right amount...',
  'Finding your best method...',
  'Preparing your recommendation...',
]

export default function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length)
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '48px 32px',
      textAlign: 'center'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '2px solid var(--border)',
        borderTop: '2px solid var(--gold)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 24px'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <p style={{
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
        letterSpacing: '0.05em',
        transition: 'opacity 0.3s ease'
      }}>
        {MESSAGES[msgIndex]}
      </p>
    </div>
  )
}