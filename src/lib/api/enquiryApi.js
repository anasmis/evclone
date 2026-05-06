// Lightweight mock API for submitting enquiries
// In production, replace with a real POST to your backend or CRM webhook.

export async function submitEnquiry(type, payload) {
  // Simulate latency and success
  await new Promise((r) => setTimeout(r, 800))

  // Very basic spam/robot guard
  if (payload && typeof payload === 'object' && 'honeypot' in payload && payload.honeypot) {
    throw new Error('Spam detected')
  }

  // Here you could POST to a real endpoint, e.g.:
  // await fetch('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, ...payload }) })

  // Persist a local echo for debugging/dev
  try {
    const key = `enquiries:${type}`
    const prev = JSON.parse(localStorage.getItem(key) || '[]')
    prev.push({ ...payload, _submittedAt: new Date().toISOString() })
    localStorage.setItem(key, JSON.stringify(prev))
  } catch {}

  return { ok: true }
}
