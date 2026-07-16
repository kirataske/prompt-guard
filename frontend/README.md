# PromptGuard — Frontend (`feat/react-chat-ui`)

## Запуск

```bash
npm install
cp .env.example .env
npm run dev        # http://localhost:5173
```

## Режими

| `VITE_USE_MOCK` | Що відбувається |
|---|---|
| `true` (default) | Мок-відповіді, бекенд не потрібен |
| `false` | Реальні запити до Node-проксі на `VITE_PROXY_URL` |

Якщо Node змінить назви полів або значення enum — оновити:
- `src/constants/attacks.js` — `ATTACK_NAMES`
- `src/constants/attacks.js` — `STATUS`

## Структура

```
src/
├── App.jsx
├── hooks/useChat.js              — стан + виклики API
├── api/client.js                 — axios до Node + mock (ВСЯ взаємодія з бекендом тут)
├── constants/attacks.js          — enum статусів, назви атак, red team приклади
└── components/
    ├── Chat/
    │   ├── ChatWindow.jsx        — список повідомлень
    │   ├── MessageBubble.jsx     — бульбашка + підсвічування фрагмента (ФФ-2, ФФ-3)
    │   ├── ChatInput.jsx         — поле вводу
    │   └── StatusBadge.jsx       — бейдж clean/suspicious/blocked
    ├── Security/
    │   ├── SecurityPanel.jsx     — обгортка з табами
    │   └── IncidentLog.jsx       — лічильники + лог інцидентів (ФФ-4)
    └── RedTeam/
        └── RedTeamPanel.jsx      — готові атаки для демо (ФФ-5)
```
