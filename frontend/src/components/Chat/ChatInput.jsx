import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../ctx/AppContext.jsx'

export default function ChatInput({ onSend, loading, prefill, onPrefillClear }) {
  const { str } = useApp()
  const [text, setText] = useState('')
  const [focused, setFocused] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (prefill) { setText(prefill); onPrefillClear(); ref.current?.focus() }
  }, [prefill])

  function submit() {
    const t = text.trim()
    if (!t || loading) return
    onSend(t); setText('')
  }

  const canSend = !loading && text.trim()

  return (
    <div style={{
      display: 'flex', gap: 8, padding: '12px 16px',
      borderTop: '1px solid var(--bd2)', background: 'var(--s1)',
    }}>
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        borderRadius: 'var(--r2)',
        border: `1px solid ${focused ? 'var(--blue)' : 'var(--bd)'}`,
        background: 'var(--bg)',
        transition: 'border-color .2s, box-shadow .2s',
        boxShadow: focused ? '0 0 0 3px var(--blue-bg)' : 'none',
        overflow: 'hidden',
      }}>
        <input
          ref={ref}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && submit()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={str.placeholder}
          disabled={loading}
          style={{
            flex: 1, padding: '10px 14px', fontSize: 13.5,
            background: 'transparent', color: 'var(--tx)',
            border: 'none', outline: 'none',
          }}
        />
      </div>
      <button
        onClick={submit}
        disabled={!canSend}
        style={{
          padding: '10px 20px', fontSize: 13, fontWeight: 500,
          borderRadius: 'var(--r2)', border: 'none',
          cursor: canSend ? 'pointer' : 'not-allowed',
          background: canSend ? 'var(--blue)' : 'var(--s3)',
          color: canSend ? '#fff' : 'var(--tx4)',
          transition: 'all .15s ease',
          transform: canSend ? 'scale(1)' : 'scale(.98)',
          letterSpacing: '.01em',
        }}
        onMouseDown={e => { if (canSend) e.currentTarget.style.transform = 'scale(.97)' }}
        onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        {loading ? str.checking : str.send}
      </button>
    </div>
  )
}
