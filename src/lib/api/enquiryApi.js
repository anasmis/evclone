// Thin wrapper around the Strapi client to keep existing call sites working.
// Use the named helpers in ./strapi.js for new code.

import {
  submitContactSubmission,
  submitLead,
  subscribeNewsletter,
} from './strapi'

export async function submitEnquiry(type, payload) {
  if (payload && typeof payload === 'object' && payload.honeypot) {
    throw new Error('Spam detected')
  }

  switch (type) {
    case 'contact':
      return submitContactSubmission(payload)
    case 'lead':
      return submitLead(payload)
    case 'newsletter':
      return subscribeNewsletter(payload?.email ?? payload)
    default:
      // Unknown types fall through to the lead pipeline with the type
      // recorded as the source for future segmentation.
      return submitLead({ ...payload, source: type })
  }
}

export { submitContactSubmission, submitLead, subscribeNewsletter }
