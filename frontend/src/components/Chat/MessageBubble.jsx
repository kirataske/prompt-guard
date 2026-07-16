import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { useApp } from '../../ctx/AppContext.jsx'
import StatusBadge from './StatusBadge.jsx'

function Highlight({ text, frag }) {
  if (!frag) return <>{text}</>
  const i = text.toLowerCase().indexOf(frag.toLowerCase())
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <mark style={{
        background: 'rgba(240,164,41,.18)', color: 'var(--yellow)',
        borderRadius: 3, padding: '1px 3px', fontWeight: 500,
        borderBottom: '1px solid rgba(240,164,41,.35)',
      }}>
        {text.slice(i, i + frag.length)}
      </mark>
      {text.slice(i + frag.length)}
    </>
  )
}

export default function MessageBubble({ msg }) {
  const { str } = useApp()
  const ref = useRef(null)
  const u = msg.role === 'user'
  const v = msg.verdict

  // scroll-reveal через IntersectionObserver
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const bg = () => {
    if (!u) return 'var(--s2)'
    if (msg.status === 'blocked')    return 'var(--red-bg)'
    if (msg.status === 'suspicious') return 'var(--yellow-bg)'
    return 'var(--s3)'
  }
  const bd = () => {
    if (!u) return '1px solid var(--bd2)'
    if (msg.status === 'blocked')    return '1px solid var(--red-bd)'
    if (msg.status === 'suspicious') return '1px solid var(--yellow-bd)'
    return '1px solid var(--bd)'
  }

  return (
    <div
      ref={ref}
      className="reveal"
      style={{
        display: 'flex', flexDirection: 'column',
        alignSelf: u ? 'flex-end' : 'flex-start',
        alignItems: u ? 'flex-end' : 'flex-start',
        maxWidth: '78%', gap: 5,
      }}
    >
      <div style={{ display: 'flex', flexDirection: u ? 'row-reverse' : 'row', alignItems: 'center', gap: 7 }}>
        <span style={{ fontSize: 11, color: 'var(--tx4)', fontWeight: 500, letterSpacing: '.02em' }}>
          {u ? str.you : str.llm}
        </span>
        <StatusBadge status={msg.status} />
      </div>

      <div style={{
        padding: '11px 15px',
        borderRadius: u ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        background: bg(), border: bd(),
        fontSize: 13.5, lineHeight: 1.7, color: 'var(--tx)', wordBreak: 'break-word',
        transition: 'border-color .2s',
      }}>
        {msg.role === 'assistant'
          ? <ReactMarkdown>{msg.text}</ReactMarkdown>
          : <Highlight text={msg.text} frag={v?.suspiciousFragment} />
        }

        {v?.attackType && (
          <div style={{
            marginTop: 10, paddingTop: 9,
            borderTop: '1px solid rgba(128,128,128,.1)',
            fontSize: 11.5,
            color: msg.status === 'blocked' ? 'var(--red)' : 'var(--yellow)',
            display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center',
          }}>
            <span>⚠ {str.attacks[v.attackType] || v.attackType}</span>
            {v.detectionLevel != null && <span style={{ color: 'var(--tx4)', fontSize: 11 }}>· {str.levelLabel} {v.detectionLevel}</span>}
            {v.confidence     != null && <span style={{ color: 'var(--tx4)', fontSize: 11 }}>· {Math.round(v.confidence * 100)}%</span>}
          </div>
        )}

        {msg.status === 'blocked' && (
          <div style={{ marginTop: 6, fontSize: 11, color: 'var(--tx4)', fontStyle: 'italic' }}>
            {str.blockedNote}
          </div>
        )}
      </div>
    </div>
  )
}
