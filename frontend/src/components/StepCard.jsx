export default function StepCard({ question, options, onSelect }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '32px',
      marginBottom: '16px'
    }}>
      <h2>{question}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              padding: '14px 20px',
              borderRadius: '8px',
              textAlign: 'left',
              fontSize: '0.95rem',
              letterSpacing: '0.02em'
            }}
            onMouseEnter={e => {
              e.target.style.border = '1px solid var(--gold)'
              e.target.style.color = 'var(--gold)'
            }}
            onMouseLeave={e => {
              e.target.style.border = '1px solid var(--border)'
              e.target.style.color = 'var(--text)'
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}