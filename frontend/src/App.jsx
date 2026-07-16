import { useState } from 'react'
import { useApp } from './ctx/AppContext.jsx'
import { useChat } from './hooks/useChat.js'
import ChatWindow from './components/Chat/ChatWindow.jsx'
import SecurityPanel from './components/Security/SecurityPanel.jsx'

function TopBtn({ onClick, children }) {
  const [hov, setHov] = useState(false)
  const [pressed, setPressed] = useState(false)
  return (
    <button
      onClick={() => { setPressed(true); setTimeout(() => setPressed(false), 180); onClick() }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '4px 12px', fontSize: 11.5, fontWeight: 500, cursor: 'pointer',
        borderRadius: 8, border: '1px solid var(--bd)',
        background: hov ? 'var(--s3)' : 'transparent',
        color: hov ? 'var(--tx2)' : 'var(--tx3)',
        transition: 'all .15s ease',
        transform: pressed ? 'scale(.96)' : 'scale(1)',
        fontFamily: 'var(--m)', letterSpacing: '.02em',
      }}
    >
      {children}
    </button>
  )
}

export default function App() {
  const { theme, lang, str, toggleTheme, toggleLang } = useApp()
  const { msgs, incidents, loading, error, send } = useChat(str.mockReplies)
  const [prefill, setPrefill] = useState('')

  function handleAttack(text) { setPrefill(text); send(text) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>

      <div className="bg-blobs" aria-hidden="true">
        <span className="blob-1" />
        <span className="blob-2" />
        <span className="blob-3" />
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* топ-бар */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '8px 18px',
          borderBottom: '1px solid var(--bd2)',
          background: 'var(--topbar-bg)',
          backdropFilter: 'blur(16px)',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--tx)' }}>
            PromptGuard
          </span>

          <span style={{
            fontSize: 11, color: 'var(--tx4)',
            padding: '3px 10px', border: '1px solid var(--bd)',
            borderRadius: 999, fontFamily: 'var(--m)', letterSpacing: '.02em',
          }}>
            Gemini · {str.proxyLabel}
          </span>

          <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
            <TopBtn onClick={toggleTheme}>{theme === 'dark' ? '☀ Light' : '☾ Dark'}</TopBtn>
            <TopBtn onClick={toggleLang}>{lang === 'uk' ? 'EN' : 'УК'}</TopBtn>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', flex: 1, overflow: 'hidden' }}>
          <ChatWindow
            msgs={msgs} loading={loading} error={error} onSend={send}
            prefill={prefill} onPrefillClear={() => setPrefill('')}
          />
          <SecurityPanel incidents={incidents} msgs={msgs} onRedTeamAttack={handleAttack} />
        </div>
      </div>
    </div>
  )
}
