// всі рядки інтерфейсу — UK і EN
// якщо додаєте новий текст — спочатку сюди, потім у компонент через useLang()

const t = {
  uk: {
    // чат
    chatTitle:      'PromptGuard Chat',
    proxyLabel:     'guardrail-proxy',
    placeholder:    'Введіть повідомлення...',
    send:           'Надіслати →',
    checking:       'Перевірка...',
    emptyChat:      'Кожен запит проходить через детектор\nперед тим як потрапити в LLM',
    you:            'ви',
    llm:            'LLM',
    blockedNote:    'Запит зупинено — до LLM не дійшов',
    proxyError:     "Помилка з'єднання з проксі",

    // статуси
    statusClean:    'чистий',
    statusSuspicious: 'підозрілий',
    statusBlocked:  'заблоковано',
    statusPending:  'перевірка...',

    // панель безпеки
    secPanel:       'Панель безпеки',
    tabIncidents:   'Інциденти',
    tabRedTeam:     'Red Team',
    noIncidents:    'Інцидентів ще не було',
    statClean:      'чистих',
    statSuspicious: 'підозр.',
    statBlocked:    'заблок.',
    levelLabel:     'рівень',
    confLabel:      'впевненість',

    // red team
    rtDesc:    'Клік — атака підставиться в чат і відправиться. Для демо детектора.',

    // типи атак
    attacks: {
      direct_injection:   "Пряма ін'єкція",
      indirect_injection: 'Непряма (RAG)',
      role_play:          'Role-play / Jailbreak',
      obfuscation:        'Обфускація',
      system_prompt_leak: 'Витік system prompt',
      payload_splitting:  'Payload splitting',
    },

    // моделі (відповіді мока)
    filterAll: 'Всі',
    filterSus: '⚠ Підозрілі',
    filterBlk: '✕ Заблоковані',
    mockReplies: [
      'Привіт! Готовий відповідати на питання про кібербезпеку.',
      'Звичайно, ось докладніша інформація...',
    ],
  },

  en: {
    chatTitle:      'PromptGuard Chat',
    proxyLabel:     'guardrail-proxy',
    placeholder:    'Type a message...',
    send:           'Send →',
    checking:       'Checking...',
    emptyChat:      'Every request passes through the detector\nbefore reaching the LLM',
    you:            'you',
    llm:            'LLM',
    blockedNote:    'Request stopped — never reached the LLM',
    proxyError:     'Proxy connection error',

    statusClean:       'clean',
    statusSuspicious:  'suspicious',
    statusBlocked:     'blocked',
    statusPending:     'checking...',

    secPanel:       'Security Panel',
    tabIncidents:   'Incidents',
    tabRedTeam:     'Red Team',
    noIncidents:    'No incidents yet',
    statClean:      'clean',
    statSuspicious: 'suspic.',
    statBlocked:    'blocked',
    levelLabel:     'level',
    confLabel:      'confidence',

    rtDesc: 'Click an attack — it will be sent to the chat instantly. For detector demo.',

    attacks: {
      direct_injection:   'Direct injection',
      indirect_injection: 'Indirect (RAG)',
      role_play:          'Role-play / Jailbreak',
      obfuscation:        'Obfuscation',
      system_prompt_leak: 'System prompt leak',
      payload_splitting:  'Payload splitting',
    },

    filterAll: 'All',
    filterSus: '⚠ Suspicious',
    filterBlk: '✕ Blocked',
    mockReplies: [
      'Hello! Ready to answer questions about cybersecurity.',
      'Sure, here is more detailed information...',
    ],
  },
}

export default t
