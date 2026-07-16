// анімовані три крапки поки LLM відповідає
export default function TypingIndicator({ label = 'LLM' }) {
  const dotStyle = (delay) => ({
    width: 5, height: 5, borderRadius: '50%',
    background: 'var(--tx4)', display: 'inline-block',
    animation: `dot${delay === 0 ? 1 : delay === 150 ? 2 : 3} 1.2s ease infinite`,
    animationDelay: `${delay}ms`,
  })

  return (
    <div className="fade-in" style={{
      display: 'flex', flexDirection: 'column',
      alignSelf: 'flex-start', alignItems: 'flex-start', gap: 5,
    }}>
      <span style={{ fontSize: 11, color: 'var(--tx4)', fontWeight: 500 }}>{label}</span>
      <div style={{
        padding: '10px 16px', borderRadius: '14px 14px 14px 4px',
        background: 'var(--s2)', border: '1px solid var(--bd2)',
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <span style={dotStyle(0)} />
        <span style={dotStyle(150)} />
        <span style={dotStyle(300)} />
      </div>
    </div>
  )
}
