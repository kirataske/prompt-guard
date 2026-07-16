import { useState } from 'react'
import { useApp } from '../../ctx/AppContext.jsx'
import { RED_TEAM } from '../../constants/attacks.js'

function AtkBtn({ atk, onClick }) {
  const { str } = useApp()
  const [hov, setHov] = useState(false)
  const [pressed, setPressed] = useState(false)

  return (
    <button
      onClick={() => { setPressed(true); setTimeout(() => setPressed(false), 300); onClick(atk.text) }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', textAlign: 'left', padding: '10px 12px',
        marginBottom: 7, borderRadius: 'var(--r)', cursor: 'pointer',
        border: `1px solid ${hov ? 'var(--red-bd)' : 'var(--bd2)'}`,
        background: pressed ? 'var(--red-bg)' : hov ? 'rgba(240,92,92,.05)' : 'var(--s2)',
        transition: 'all .15s ease',
        transform: pressed ? 'scale(.99)' : 'scale(1)',
      }}
    >
      <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--red)', marginBottom: 4, letterSpacing: '.02em' }}>
        {str.attacks[atk.type] || atk.type}
      </div>
      <div style={{
        fontSize: 11, color: 'var(--tx3)', fontFamily: 'var(--m)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {atk.text}
      </div>
    </button>
  )
}

export default function RedTeamPanel({ onAttack }) {
  const { str } = useApp()
  return (
    <div style={{ padding: 12, overflowY: 'auto', flex: 1 }}>
      <p style={{ fontSize: 11.5, color: 'var(--tx4)', marginBottom: 14, lineHeight: 1.75 }}>
        {str.rtDesc}
      </p>
      {RED_TEAM.map((atk, i) => (
        <AtkBtn key={i} atk={atk} onClick={onAttack} />
      ))}
    </div>
  )
}
