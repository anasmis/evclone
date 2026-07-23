// n8n webhook client for the floating assistant.
//
// The chat widget POSTs each user message here; the n8n workflow (typically a
// Webhook trigger → AI Agent → Respond to Webhook) returns the advisor's reply.
//
// Configure via Vite env vars (see .env.local):
//   VITE_N8N_WEBHOOK_URL    -> the Production URL of the n8n Webhook node
//   VITE_N8N_WEBHOOK_AUTH_HEADER -> optional custom header name
//   VITE_N8N_WEBHOOK_AUTH_VALUE  -> value sent in that custom header
//   VITE_N8N_WEBHOOK_TOKEN       -> optional legacy bearer token, sent as
//                                   `Authorization: Bearer <token>`

const WEBHOOK_URL = (import.meta.env.VITE_N8N_WEBHOOK_URL || '').trim()
const WEBHOOK_TOKEN = (import.meta.env.VITE_N8N_WEBHOOK_TOKEN || '').trim()
const WEBHOOK_AUTH_HEADER = (import.meta.env.VITE_N8N_WEBHOOK_AUTH_HEADER || '').trim()
const WEBHOOK_AUTH_VALUE = (import.meta.env.VITE_N8N_WEBHOOK_AUTH_VALUE || '').trim()

export const isAssistantConfigured = () => Boolean(WEBHOOK_URL)

export class AssistantError extends Error {
  constructor(message, { status } = {}) {
    super(message)
    this.name = 'AssistantError'
    this.status = status
  }
}

function buildAssistantAuthHeaders() {
  const hasCustomHeaderName = Boolean(WEBHOOK_AUTH_HEADER)
  const hasCustomHeaderValue = Boolean(WEBHOOK_AUTH_VALUE)

  if (hasCustomHeaderName !== hasCustomHeaderValue) {
    throw new AssistantError(
      'Assistant auth header config is incomplete. Set both VITE_N8N_WEBHOOK_AUTH_HEADER and VITE_N8N_WEBHOOK_AUTH_VALUE, or leave both empty.',
    )
  }

  const authHeaders = {}
  if (hasCustomHeaderName) authHeaders[WEBHOOK_AUTH_HEADER] = WEBHOOK_AUTH_VALUE
  if (WEBHOOK_TOKEN) authHeaders.Authorization = `Bearer ${WEBHOOK_TOKEN}`

  return authHeaders
}

// n8n workflows return wildly different shapes depending on how they're wired
// (AI Agent → { output }, a Set node → { reply }, a raw string, an array with a
// single item, …). Dig out the first usable string so the widget doesn't care
// how the workflow is built.
function extractReply(data) {
  if (data == null) return ''
  if (typeof data === 'string') return data.trim()
  if (Array.isArray(data)) {
    for (const item of data) {
      const found = extractReply(item)
      if (found) return found
    }
    return ''
  }
  if (typeof data === 'object') {
    const direct =
      data.reply ??
      data.output ??
      data.text ??
      data.message ??
      data.answer ??
      data.response ??
      data.content
    if (typeof direct === 'string' && direct.trim()) return direct.trim()
    if (direct && typeof direct === 'object') {
      const nested = extractReply(direct)
      if (nested) return nested
    }
    // Fall back to the first string value on the object.
    for (const value of Object.values(data)) {
      if (typeof value === 'string' && value.trim()) return value.trim()
    }
  }
  return ''
}

// Send one user message and resolve to the advisor's reply text.
// `sessionId` lets the n8n AI Agent keep per-visitor conversation memory.
export async function sendAssistantMessage({ message, sessionId, advisor, history } = {}) {
  if (!WEBHOOK_URL) {
    throw new AssistantError(
      'Assistant webhook URL is not configured. Set VITE_N8N_WEBHOOK_URL in your .env.local.',
    )
  }

  const headers = {
    'Content-Type': 'application/json',
    ...buildAssistantAuthHeaders(),
  }

  // Send the message under a few common keys so the workflow can read whichever
  // its trigger/agent expects (`chatInput` for the AI Agent, `message`, …).
  const body = {
    message,
    chatInput: message,
    sessionId,
    advisor: advisor ? { name: advisor.name, role: advisor.role } : undefined,
    history,
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    sentAt: new Date().toISOString(),
  }

  let res
  try {
    res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
  } catch (err) {
    throw new AssistantError(`Network error contacting assistant: ${err.message}`, { status: 0 })
  }

  if (!res.ok) {
    throw new AssistantError(`Assistant webhook failed with status ${res.status}`, {
      status: res.status,
    })
  }

  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : ''
  } catch {
    data = text // non-JSON body — treat the raw text as the reply
  }

  return extractReply(data)
}
