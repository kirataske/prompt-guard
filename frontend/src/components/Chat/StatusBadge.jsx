import { useApp } from '../../ctx/AppContext.jsx'

// крутилка для pending-стану
function Spinner() {
  return (
    <span style={{
      display: 'inline-block', width: 8, height: 8,
      border: '1.5px solid var(--tx4)', borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'pendingSpin .7s linear infinite',
    }} />
  )
}

export default function StatusBadge({ status }) {
  const { str } = useApp()

  const cfg = {
    clean:      { label: str.statusClean,      color: 'var(--green)', bg: 'var(--green-bg)', bd: 'var(--green-bd)', icon: '✓' },
    suspicious: { label: str.statusSuspicious, color: 'var(--yellow)', bg: 'var(--yellow-bg)', bd: 'var(--yellow-bd)', icon: '⚠' },
    blocked:    { label: str.statusBlocked,    color: 'var(--red)',   bg: 'var(--red-bg)',   bd: 'var(--red-bd)',   icon: '✕' },
    pending:    { label: str.statusPending,    color: 'var(--tx3)',   bg: 'var(--s3)',       bd: 'var(--bd)',       icon: null },
  }
  const s = cfg[status] || cfg.pending

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 10, fontWeight: 500, letterSpacing: '.01em',
      padding: '2px 8px 2px 6px', borderRadius: 999,
      background: s.bg, color: s.color, border: `1px solid ${s.bd}`,
      transition: 'all .2s ease',
    }}>
      {status === 'pending' ? <Spinner /> : <span style={{ fontSize: 9 }}>{s.icon}</span>}
      {s.label}
    </span>
  )
}
