// Thin wrapper around the Strapi client to keep existing call sites working.
// Use the named helpers in ./strapi.js for new code.

import { submitContactSubmission, subscribeNewsletter } from './strapi'

export async function submitEnquiry(type, payload) {
  if (payload && typeof payload === 'object' && payload.honeypot) {
    throw new Error('Spam detected')
  }

  switch (type) {
    case 'newsletter':
      return subscribeNewsletter(payload?.email ?? payload)
    case 'contact':
    default:
      // The generic lead bucket was removed; anything that isn't a newsletter
      // signup is recorded as a contact submission.
      return submitContactSubmission(payload)
  }
}

export { submitContactSubmission, subscribeNewsletter }
