import { useEffect, useRef } from 'react'
import { useApp } from '../../ctx/AppContext.jsx'
import MessageBubble from './MessageBubble.jsx'
import TypingIndicator from './TypingIndicator.jsx'
import ChatInput from './ChatInput.jsx'

export default function ChatWindow({ msgs, loading, error, onSend, prefill, onPrefillClear }) {
  const { str } = useApp()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, loading])

  const lastMsg = msgs[msgs.length - 1]
  const showTyping = loading && lastMsg?.status === 'clean'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '24px 20px',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        {msgs.length === 0 && !loading && (
          <div className="fade-in" style={{
            margin: 'auto', textAlign: 'center',
            color: 'var(--tx4)', fontSize: 13, lineHeight: 2.1,
          }}>
            <div style={{ fontSize: 34, marginBottom: 10 }}>🛡</div>
            {str.emptyChat.split('\n').map((l, i) => <div key={i}>{l}</div>)}
          </div>
        )}

        {msgs.map(m => <MessageBubble key={m.id} msg={m} />)}
        {showTyping && <TypingIndicator label={str.llm} />}

        {error && (
          <div className="fade-up" style={{
            padding: '10px 14px', borderRadius: 'var(--r)',
            background: 'var(--red-bg)', border: '1px solid var(--red-bd)',
            color: 'var(--red)', fontSize: 12,
          }}>
            ✕ {str.proxyError}: {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={onSend} loading={loading} prefill={prefill} onPrefillClear={onPrefillClear} />
    </div>
  )
}
