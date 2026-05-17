export default function LoadingScreen() {
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
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
        Analysing your hair profile...
      </p>
    </div>
  )
}