// ============================================================
// NODE GUARDRAIL-PROXY — повний контракт
//
// POST /
//   req:  { prompt: string }
//   200:  { status: "ok", response: string }
//   403:  { status: "injection_detected", incident: {
//             id, userIp, attackType, severity, verdict, segment } }
//   429:  rate limit
//   500:  server error
//
// GET /incidents
//   200:  { status: "ok", incidents: [...] }
// ============================================================

import axios from 'axios'

const MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const BASE = import.meta.env.VITE_PROXY_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
})

const ATTACK_MAP = {
  direct_injection:   'direct_injection',
  indirect_injection: 'indirect_injection',
  system_prompt_leak: 'system_prompt_leak',
  role_play:          'role_play',
  obfuscation:        'obfuscation',
  payload_splitting:  'payload_splitting',
  none:               null,
}

const SEVERITY_MAP = {
  low: 'low',
  medium: 'medium',
  high: 'high',
}

function incidentToVerdict(inc) {
  return {
    risk:               SEVERITY_MAP[inc.severity] || null,
    attackType:         ATTACK_MAP[inc.attackType] ?? null,
    suspiciousFragment: inc.segment || null,
    detectionLevel:     null,
    confidence:         null,
  }
}

// ─── Mock ────────────────────────────────────────────────────
const mockQueue = [
  { status: 'clean', verdict: null, replyKey: 0 },
  { status: 'blocked', verdict: { risk: 'high', attackType: 'direct_injection', suspiciousFragment: 'ignore previous instructions', detectionLevel: 2, confidence: 0.93 }, replyKey: null },
  { status: 'suspicious', verdict: { risk: 'medium', attackType: 'role_play', suspiciousFragment: 'without restrictions', detectionLevel: 1, confidence: 0.71 }, replyKey: null },
  { status: 'clean', verdict: null, replyKey: 1 },
]
let mockIdx = 0

async function mockSend(mockReplies) {
  await new Promise(r => setTimeout(r, 380 + Math.random() * 280))
  const r = mockQueue[mockIdx % mockQueue.length]
  mockIdx++
  return { ...r, reply: r.replyKey != null ? mockReplies[r.replyKey] : null }
}

// ─── Реальні виклики ─────────────────────────────────────────
export async function sendMessage(sessionId, text, mockReplies) {
  if (MOCK) return mockSend(mockReplies)

  try {
    const { data } = await api.post('/', { sessionId, prompt: text })
    return { status: 'clean', verdict: null, reply: data.response || null }
  } catch (err) {
    const data = err.response?.data

    // 403 — ін'єкція виявлена
    if (err.response?.status === 403 && data?.status === 'injection_detected') {
      return {
        status:  data.incident.verdict,
        verdict: incidentToVerdict(data.incident),
        reply:   null,
      }
    }

    // 429 — rate limit
    if (err.response?.status === 429) {
      throw new Error(data?.message || 'Rate limit reached')
    }

    throw new Error(data?.message || `proxy ${err.response?.status}`)
  }
}

export async function getIncidents() {
  if (MOCK) return { incidents: [] }

  try {
    const { data } = await api.get('/incidents')
    const incidents = (data.incidents || []).map(inc => ({
      id:                 inc.id,
      ts:                 new Date(),
      status:             inc.verdict,
      attackType:         ATTACK_MAP[inc.attackType] ?? null,
      suspiciousFragment: inc.segment || null,
      risk:               SEVERITY_MAP[inc.severity] || null,
      detectionLevel:     null,
      confidence:         null,
    }))
    return { incidents }
  } catch {
    return { incidents: [] }
  }
}
