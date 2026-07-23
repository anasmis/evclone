import { useState } from 'react'
import MirrorShell from './MirrorShell'
import Breadcrumb from '../components/sections/Breadcrumb'
import { submitEnquiry } from '../lib/api/enquiryApi'

const TOPICS = [
  { value: 'installation-domicile', label: 'Installation domicile' },
  { value: 'installation-entreprise', label: 'Installation entreprise' },
  { value: 'support', label: 'Support technique' },
  { value: 'autre', label: 'Autre' },
]

const initialValues = {
  fullName: '',
  email: '',
  phone: '',
  topic: 'installation-domicile',
  subject: '',
  message: '',
}

const MAPS_QUERY = 'Mega Business Center, Boulevard Zoulikha Nasri, Sidi Maarouf, Casablanca'
const MAPS_DEEP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`
const MAPS_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&output=embed&z=16`

export default function ContactUs() {
  const [values, setValues] = useState(initialValues)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) {
      setErrors((e) => {
        const next = { ...e }
        delete next[field]
        return next
      })
    }
  }

  function validate() {
    const e = {}
    if (!values.fullName.trim()) e.fullName = 'Champ requis'
    if (!values.email.trim()) e.email = 'Champ requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = 'Email invalide'
    if (!values.subject.trim()) e.subject = 'Champ requis'
    if (!values.message.trim()) e.message = 'Champ requis'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit(event) {
    event.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await submitEnquiry('contact', values)
      setSent(true)
    } catch (err) {
      setErrors((e) => ({ ...e, _form: err?.message || "Erreur lors de l'envoi" }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <MirrorShell documentTitle="Contactez-nous | EVplug">
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb current="Contactez-nous" />

            {/* Hero (two-card layout) */}
            <section className="two-card-layout">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto md:py-spacing-7xl pt-spacing-7xl pb-spacing-4xl">
                <div className="grid xl:grid-flow-col gap-spacing-3xl items-stretch xl:grid-cols-3">
                  <div
                    className="m-0 xl:col-span-2 rounded-2xl md:p-spacing-6xl py-spacing-6xl px-spacing-4xl grid gap-spacing-4xl items-center"
                    style={{ backgroundColor: '#F5F1EB' }}
                  >
                    <div className="grid gap-spacing-2xl auto-rows-max w-full">
                      <h1 className="font-TTCommons mb-0" style={{ color: '#000000' }}>
                        Contactez-nous
                      </h1>

                      <ul className="contact-info-list">
                        <li className="contact-info-item contact-info-item--map">
                          <span className="contact-info-icon" aria-hidden="true">
                            <i className="fa-solid fa-location-dot" />
                          </span>
                          <div className="contact-info-body">
                            <span className="contact-info-label">Adresse</span>
                            <span className="contact-info-value">
                              Boulevard Zoulikha Nasri, Florida 5eme Etage Bureau N26
                              <br />
                              Mega Business Center — Sidi Maarouf, Casablanca
                            </span>
                            <a
                              className="contact-info-maps-cta"
                              href={MAPS_DEEP_LINK}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fa-solid fa-diamond-turn-right" />
                              Ouvrir dans Google Maps
                            </a>
                          </div>
                          <a
                            className="contact-info-map"
                            href={MAPS_DEEP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Ouvrir l'adresse dans Google Maps"
                          >
                            <iframe
                              title="Carte EVplug Maroc - Sidi Maarouf"
                              src={MAPS_EMBED}
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              tabIndex={-1}
                            />
                            <span className="contact-info-map-overlay" aria-hidden="true">
                              <i className="fa-solid fa-up-right-from-square" />
                            </span>
                          </a>
                        </li>
                        <li className="contact-info-item">
                          <span className="contact-info-icon" aria-hidden="true">
                            <i className="fa-solid fa-envelope" />
                          </span>
                          <div className="contact-info-body">
                            <span className="contact-info-label">Email</span>
                            <a className="contact-info-value contact-info-link" href="mailto:contact@evplug.ma">
                              contact@evplug.ma
                            </a>
                          </div>
                        </li>
                        <li className="contact-info-item">
                          <span className="contact-info-icon" aria-hidden="true">
                            <i className="fa-solid fa-phone" />
                          </span>
                          <div className="contact-info-body">
                            <span className="contact-info-label">Téléphone</span>
                            <a className="contact-info-value contact-info-link" href="tel:+212661116626">
                              +212 661 11 66 26
                            </a>
                            <a className="contact-info-value contact-info-link" href="tel:+212661228010">
                              +212 661 22 80 10
                            </a>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div
                    className="rounded-2xl md:py-spacing-6xl md:px-spacing-4xl p-spacing-4xl grid gap-spacing-2xl items-start content-start"
                    style={{ backgroundColor: '#123d33', color: '#ffffff' }}
                  >
                    <div className="flex items-center gap-spacing-md">
                      <span
                        className="inline-flex items-center justify-center rounded-full"
                        style={{
                          width: '42px',
                          height: '42px',
                          backgroundColor: '#c8d72d',
                          color: '#123d33',
                        }}
                        aria-hidden="true"
                      >
                        <i className="fa-solid fa-headset" />
                      </span>
                      <h3 className="m-0 font-TTCommons" style={{ color: '#c8d72d' }}>
                        Support
                      </h3>
                    </div>
                    <p className="m-0" style={{ color: '#f5f1eb' }}>
                      Pour toute action de support, merci d'appeler ce numéro dédié :
                    </p>
                    <a
                      href="tel:+212521335075"
                      className="font-TTCommons font-bold"
                      style={{
                        fontSize: '1.75rem',
                        color: '#c8d72d',
                        textDecoration: 'none',
                        letterSpacing: '0.02em',
                      }}
                    >
                      05 21 33 50 75
                    </a>
                    <p className="m-0" style={{ color: '#f5f1eb' }}>
                      Ou ouvrez un ticket en ligne :
                    </p>
                    <a
                      href="https://myaccount.evplug.ma/forms/ticket?styled=1&with_logo=1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full font-semibold"
                      style={{
                        padding: '0.7rem 1.25rem',
                        backgroundColor: '#c8d72d',
                        color: '#123d33',
                        textDecoration: 'none',
                        width: 'fit-content',
                      }}
                    >
                      Ouvrir un ticket
                      <i className="fa-solid fa-arrow-up-right-from-square ml-2" />
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact form */}
            <section
              id="contact-message"
              className="header-two relative top-spacing"
              style={{ backgroundColor: '#f5f1eb' }}
            >
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto pt-spacing-7xl pb-spacing-7xl">
                <div className="contact-form-card">
                  <header className="contact-form-card__header">
                    <h2 className="contact-form-card__title">Envoyez-nous un message</h2>
                    <p className="contact-form-card__subtitle">
                      Remplissez ce formulaire et notre équipe vous recontactera sous 24 à 48 heures ouvrées.
                    </p>
                  </header>

                  {sent ? (
                    <div className="contact-form-card__body contact-form-card__success" aria-live="polite">
                      <div className="contact-form-success-icon">
                        <i className="fa-solid fa-check" />
                      </div>
                      <h3 className="m-0">Merci, votre message est bien envoyé.</h3>
                      <p className="m-0">
                        Notre équipe vous recontactera sous 24 à 48 heures ouvrées.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setValues(initialValues)
                          setSent(false)
                          setErrors({})
                        }}
                        className="contact-form-submit"
                      >
                        Envoyer un nouveau message
                      </button>
                    </div>
                  ) : (
                    <form className="contact-form-card__body" onSubmit={onSubmit} noValidate>
                      {errors._form && (
                        <div className="contact-form-status-error" role="alert">
                          {errors._form}
                        </div>
                      )}

                      <div className="contact-form-grid">
                        <div className={`contact-form-field${errors.fullName ? ' has-error' : ''}`}>
                          <label htmlFor="contact-fullName">Nom complet</label>
                          <input
                            id="contact-fullName"
                            type="text"
                            name="fullName"
                            autoComplete="name"
                            required
                            value={values.fullName}
                            onChange={(e) => update('fullName', e.target.value)}
                            placeholder="Votre nom"
                          />
                          {errors.fullName && (
                            <span className="contact-form-error">{errors.fullName}</span>
                          )}
                        </div>
                        <div className={`contact-form-field${errors.email ? ' has-error' : ''}`}>
                          <label htmlFor="contact-email">Email</label>
                          <input
                            id="contact-email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            required
                            value={values.email}
                            onChange={(e) => update('email', e.target.value)}
                            placeholder="vous@exemple.com"
                          />
                          {errors.email && (
                            <span className="contact-form-error">{errors.email}</span>
                          )}
                        </div>
                        <div className="contact-form-field">
                          <label htmlFor="contact-phone">Téléphone</label>
                          <input
                            id="contact-phone"
                            type="tel"
                            name="phone"
                            autoComplete="tel"
                            value={values.phone}
                            onChange={(e) => update('phone', e.target.value)}
                            placeholder="+212 ..."
                          />
                        </div>
                        <div className="contact-form-field">
                          <label htmlFor="contact-topic">Type de demande</label>
                          <select
                            id="contact-topic"
                            name="topic"
                            value={values.topic}
                            onChange={(e) => update('topic', e.target.value)}
                          >
                            {TOPICS.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className={`contact-form-field${errors.subject ? ' has-error' : ''}`}>
                        <label htmlFor="contact-subject">Objet</label>
                        <input
                          id="contact-subject"
                          type="text"
                          name="subject"
                          required
                          value={values.subject}
                          onChange={(e) => update('subject', e.target.value)}
                          placeholder="Sujet de votre demande"
                        />
                        {errors.subject && (
                          <span className="contact-form-error">{errors.subject}</span>
                        )}
                      </div>

                      <div className={`contact-form-field${errors.message ? ' has-error' : ''}`}>
                        <label htmlFor="contact-message-input">Message</label>
                        <textarea
                          id="contact-message-input"
                          name="message"
                          rows={6}
                          required
                          value={values.message}
                          onChange={(e) => update('message', e.target.value)}
                          placeholder="Décrivez votre besoin"
                        />
                        {errors.message && (
                          <span className="contact-form-error">{errors.message}</span>
                        )}
                      </div>

                      <div className="contact-form-actions">
                        <button type="submit" disabled={loading} className="contact-form-submit">
                          {loading ? 'Envoi en cours…' : 'Envoyer le message'}
                        </button>
                        <p className="contact-form-foot">Nous répondons du lundi au vendredi.</p>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </section>
          </div>
        </article>
      </div>
    </MirrorShell>
  )
}
