import { useState } from 'react'
import { useApp } from '../../ctx/AppContext.jsx'
import IncidentLog from './IncidentLog.jsx'
import RedTeamPanel from '../RedTeam/RedTeamPanel.jsx'

export default function SecurityPanel({ incidents, msgs, onRedTeamAttack }) {
  const { str } = useApp()
  const [tab, setTab] = useState('log')

  const tabs = [
    { id: 'log', label: str.tabIncidents },
    { id: 'rt',  label: str.tabRedTeam },
  ]

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      borderLeft: '1px solid var(--bd2)', background: 'var(--s1)', overflow: 'hidden',
    }}>
      {/* хедер */}
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid var(--bd2)',
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        <span style={{ fontSize: 15 }}>🛡</span>
        <span style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-.01em' }}>{str.secPanel}</span>
        {incidents.length > 0 && (
          <span style={{
            marginLeft: 'auto', minWidth: 20, height: 20,
            borderRadius: 999, background: 'var(--red-bg)',
            border: '1px solid var(--red-bd)', color: 'var(--red)',
            fontSize: 10, fontWeight: 600, fontFamily: 'var(--m)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 6px',
          }}>
            {incidents.length}
          </span>
        )}
      </div>

      {/* таби */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--bd2)', flexShrink: 0 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: '9px 0', fontSize: 12, fontWeight: tab === t.id ? 500 : 400,
              background: 'none', border: 'none', cursor: 'pointer',
              color: tab === t.id ? 'var(--blue)' : 'var(--tx3)',
              borderBottom: `2px solid ${tab === t.id ? 'var(--blue)' : 'transparent'}`,
              transition: 'all .18s ease',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'log'
        ? <IncidentLog incidents={incidents} msgs={msgs} />
        : <RedTeamPanel onAttack={onRedTeamAttack} />
      }
    </div>
  )
}
