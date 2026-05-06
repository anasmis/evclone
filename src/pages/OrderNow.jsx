import { useLayoutEffect, useMemo, useState } from 'react'
import HtmlBlock from '../components/common/HtmlBlock'
import Navbar from '../components/home/Navbar'
import Footer from '../components/home/Footer'
import homeBodyRaw from '../migrated/home-body.html?raw'
import { migrateBodyMarkup } from '../lib/mirrorMarkup'
import { splitShellBlocks } from '../lib/mirrorSplit'
import { submitEnquiry } from '../lib/api/enquiryApi'

function Field({ label, id, children, required }) {
  return (
    <label htmlFor={id} className="grid gap-1">
      <span className="font-semibold text-sm">{label}{required && <span className="text-red-500"> *</span>}</span>
      {children}
    </label>
  )
}

function TextInput(props) {
  return (
    <input
      {...props}
      className={
        'w-full rounded-lg border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ' +
        (props.className || '')
      }
    />
  )
}

function Select(props) {
  return (
    <select
      {...props}
      className={
        'w-full rounded-lg border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ' +
        (props.className || '')
      }
    />
  )
}

function Checkbox({ id, checked, onChange, label }) {
  return (
    <label className="flex items-start gap-2 select-none">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1" />
      <span className="text-sm">{label}</span>
    </label>
  )
}

function Badge({ children, color = 'bg-pear text-black' }) {
  return (
    <span className={`absolute -top-[24px] right-4 font-semibold py-spacing-sm px-spacing-md rounded-md text-lg text-center ${color}`}>
      {children}
    </span>
  )
}

function SaveBadge({ note }) {
  return <Badge color="bg-pear text-black">{note}</Badge>
}

function SuccessPane({ title, subtitle, onReset }) {
  return (
    <div className="grid gap-4 p-6 rounded-xl bg-green-50 border border-green-200 text-green-900">
      <div className="text-xl font-semibold">{title}</div>
      {subtitle && <p className="text-sm opacity-90">{subtitle}</p>}
      <div>
        <button onClick={onReset} className="btn-secondary font-base">
          Envoyer une nouvelle demande
        </button>
      </div>
    </div>
  )
}

function useFormState(initial) {
  const [values, setValues] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }))
  }

  function validate(required) {
    const e = {}
    for (const key of required) {
      if (!values[key] || String(values[key]).trim() === '') e[key] = 'Requis'
    }
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = 'Email invalide'
    if (values.phone && !/^[0-9+()\s-]{6,}$/.test(values.phone)) e.phone = 'Telephone invalide'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function submit(type, required) {
    if (!validate(required)) return false
    setLoading(true)
    try {
      await submitEnquiry(type, values)
      setSent(true)
      return true
    } catch (err) {
      setErrors((e) => ({ ...e, _form: err?.message || 'Erreur lors de l\'envoi' }))
      return false
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setValues(initial)
    setLoading(false)
    setSent(false)
    setErrors({})
  }

  return { values, update, loading, sent, errors, submit, reset }
}

function InstallationForm() {
  const form = useFormState({
    product: 'installation',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    postcode: '',
    propertyType: '',
    vehicle: '',
    preferredDate: '',
    notes: '',
    acceptPrivacy: false,
    honeypot: '',
  })

  const required = useMemo(
    () => ['firstName', 'lastName', 'email', 'phone', 'address', 'postcode', 'propertyType', 'vehicle', 'acceptPrivacy'],
    []
  )

  if (form.sent) {
    return (
      <SuccessPane
        title="Merci ! Nous avons bien recu votre demande."
        subtitle="Un conseiller EVplug vous contactera sous 1 jour ouvrable."
        onReset={form.reset}
      />
    )
  }

  return (
    <div className="grid gap-spacing-2xl">
      {form.errors._form && <p className="text-sm text-red-600">{form.errors._form}</p>}
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Prenom" id="ins-firstName" required>
          <TextInput id="ins-firstName" value={form.values.firstName} onChange={(e) => form.update('firstName', e.target.value)} />
        </Field>
        <Field label="Nom" id="ins-lastName" required>
          <TextInput id="ins-lastName" value={form.values.lastName} onChange={(e) => form.update('lastName', e.target.value)} />
        </Field>
        <Field label="Email" id="ins-email" required>
          <TextInput id="ins-email" type="email" value={form.values.email} onChange={(e) => form.update('email', e.target.value)} />
        </Field>
        <Field label="Telephone" id="ins-phone" required>
          <TextInput id="ins-phone" inputMode="tel" value={form.values.phone} onChange={(e) => form.update('phone', e.target.value)} />
        </Field>
        <Field label="Adresse" id="ins-address" required>
          <TextInput id="ins-address" value={form.values.address} onChange={(e) => form.update('address', e.target.value)} />
        </Field>
        <Field label="Code postal" id="ins-postcode" required>
          <TextInput id="ins-postcode" value={form.values.postcode} onChange={(e) => form.update('postcode', e.target.value)} />
        </Field>
        <Field label="Type de logement" id="ins-propertyType" required>
          <Select id="ins-propertyType" value={form.values.propertyType} onChange={(e) => form.update('propertyType', e.target.value)}>
            <option value="">Choisir…</option>
            <option>Maison individuelle</option>
            <option>Appartement</option>
            <option>Autre</option>
          </Select>
        </Field>
        <Field label="Vehicule (modele)" id="ins-vehicle" required>
          <TextInput id="ins-vehicle" value={form.values.vehicle} onChange={(e) => form.update('vehicle', e.target.value)} />
        </Field>
        <Field label="Date preferee (optionnel)" id="ins-preferredDate">
          <TextInput id="ins-preferredDate" type="date" value={form.values.preferredDate} onChange={(e) => form.update('preferredDate', e.target.value)} />
        </Field>
        <div />
        <Field label="Notes (optionnel)" id="ins-notes">
          <textarea id="ins-notes" rows={4} value={form.values.notes} onChange={(e) => form.update('notes', e.target.value)} className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
        </Field>
        {/* Honeypot */}
        <input type="text" value={form.values.honeypot} onChange={(e) => form.update('honeypot', e.target.value)} className="hidden" aria-hidden="true" tabIndex={-1} />
      </div>

      <div className="grid gap-3">
        <Checkbox
          id="ins-acceptPrivacy"
          checked={form.values.acceptPrivacy}
          onChange={(v) => form.update('acceptPrivacy', v)}
          label={
            <span>
              J'accepte la politique de confidentialite et le traitement de mes donnees.
            </span>
          }
        />
        {Object.keys(form.errors).filter((k) => k !== '_form').length > 0 && (
          <p className="text-red-600 text-sm">Veuillez completer les champs requis.</p>
        )}
        <div className="flex gap-3">
          <button
            className="btn-secondary font-base w-full"
            disabled={form.loading}
            onClick={() => form.submit('installation', required)}
          >
            {form.loading ? 'Envoi…' : 'Demander une installation'}
          </button>
        </div>
      </div>
    </div>
  )
}

function CardForm() {
  const form = useFormState({
    product: 'card',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    postcode: '',
    energySupplier: '',
    vehicle: '',
    agreeSubscription: false,
    acceptPrivacy: false,
    notes: '',
    honeypot: '',
  })

  const required = useMemo(
    () => ['firstName', 'lastName', 'email', 'phone', 'address', 'postcode', 'energySupplier', 'vehicle', 'agreeSubscription', 'acceptPrivacy'],
    []
  )

  if (form.sent) {
    return (
      <SuccessPane
        title="Merci ! Votre demande EVplug Card est bien envoyee."
        subtitle="Nous verifierons votre eligibilite et vous recontacterons rapidement."
        onReset={form.reset}
      />
    )
  }

  return (
    <div className="grid gap-spacing-2xl">
      {form.errors._form && <p className="text-sm text-red-600">{form.errors._form}</p>}
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Prenom" id="card-firstName" required>
          <TextInput id="card-firstName" value={form.values.firstName} onChange={(e) => form.update('firstName', e.target.value)} />
        </Field>
        <Field label="Nom" id="card-lastName" required>
          <TextInput id="card-lastName" value={form.values.lastName} onChange={(e) => form.update('lastName', e.target.value)} />
        </Field>
        <Field label="Email" id="card-email" required>
          <TextInput id="card-email" type="email" value={form.values.email} onChange={(e) => form.update('email', e.target.value)} />
        </Field>
        <Field label="Telephone" id="card-phone" required>
          <TextInput id="card-phone" inputMode="tel" value={form.values.phone} onChange={(e) => form.update('phone', e.target.value)} />
        </Field>
        <Field label="Adresse" id="card-address" required>
          <TextInput id="card-address" value={form.values.address} onChange={(e) => form.update('address', e.target.value)} />
        </Field>
        <Field label="Code postal" id="card-postcode" required>
          <TextInput id="card-postcode" value={form.values.postcode} onChange={(e) => form.update('postcode', e.target.value)} />
        </Field>
        <Field label="Fournisseur d'energie" id="card-energySupplier" required>
          <Select id="card-energySupplier" value={form.values.energySupplier} onChange={(e) => form.update('energySupplier', e.target.value)}>
            <option value="">Choisir…</option>
            <option>ONEE</option>
            <option>Lydec</option>
            <option>Redal</option>
            <option>Autre</option>
          </Select>
        </Field>
        <Field label="Vehicule (modele)" id="card-vehicle" required>
          <TextInput id="card-vehicle" value={form.values.vehicle} onChange={(e) => form.update('vehicle', e.target.value)} />
        </Field>
        <Field label="Notes (optionnel)" id="card-notes">
          <textarea id="card-notes" rows={4} value={form.values.notes} onChange={(e) => form.update('notes', e.target.value)} className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
        </Field>
        <div />
        {/* Honeypot */}
        <input type="text" value={form.values.honeypot} onChange={(e) => form.update('honeypot', e.target.value)} className="hidden" aria-hidden="true" tabIndex={-1} />
      </div>

      <div className="grid gap-3">
        <Checkbox
          id="card-agreeSubscription"
          checked={form.values.agreeSubscription}
          onChange={(v) => form.update('agreeSubscription', v)}
          label={<span>J'accepte les conditions d'abonnement EVplug Card (40 MAD/mois).</span>}
        />
        <Checkbox
          id="card-acceptPrivacy"
          checked={form.values.acceptPrivacy}
          onChange={(v) => form.update('acceptPrivacy', v)}
          label={<span>J'accepte la politique de confidentialite et le traitement de mes donnees.</span>}
        />
        {Object.keys(form.errors).filter((k) => k !== '_form').length > 0 && (
          <p className="text-red-600 text-sm">Veuillez completer les champs requis.</p>
        )}
        <div className="flex gap-3">
          <button
            className="btn-secondary font-base w-full"
            disabled={form.loading}
            onClick={() => form.submit('card', required)}
          >
            {form.loading ? 'Envoi…' : "Demander EVplug Card"}
          </button>
        </div>
      </div>
    </div>
  )
}

function TwoCardsLayout() {
  const [active, setActive] = useState('installation') // 'installation' | 'card'

  const tabs = [
    { id: 'installation', label: 'Installer une borne' },
    { id: 'card', label: 'EVplug Card' },
  ]

  return (
    <section className="relative image-with-two-cards bg-surface">
      <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-7xl md:pt-spacing-7xl py-spacing-4xl">
        <div className="flex gap-spacing-4xl flex-col-reverse xl:flex-row xl:flex-nowrap xl:grid-flow-col ">
          <div className="rounded-2xl overflow-hidden xl:w-5/12">
            <img src="https://podenergy.com/sites/default/files/styles/b28_image_with_two_cards/public/2026-01/CRS04428.jpg.webp?h=fa5f4214&itok=swYyXmvs" alt="CRS04428" className="w-full h-full object-cover md:aspect-3/2 aspect-2/1" />
          </div>

          <div className="flex xl:w-7/12 flex-wrap">
            <div className="max-w-[480px] grid gap-spacing-2xl mb-12">
              <h3 className="tracking-tight m-0">Deux facons simples de demarrer la recharge a domicile</h3>
              <div className="m-0">
                <p>Choisissez la solution adaptee a votre usage. Les deux options incluent une installation standard EVplug.</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="w-full mb-spacing-2xl">
              <div role="tablist" aria-label="Choisir une option" className="w-full md:w-auto p-0 bg-transparent">
                <div className="grid grid-cols-2 gap-spacing-sm">
                  {tabs.map((t) => (
                    <button
                      key={t.id}
                      role="tab"
                      aria-selected={active === t.id}
                      aria-controls={`panel-${t.id}`}
                      id={`tab-${t.id}`}
                      onClick={() => setActive(t.id)}
                      className={
                        'px-spacing-2xl py-spacing-md md:py-spacing-lg font-semibold transition-colors text-base md:text-lg focus:outline-none ' +
                        (active === t.id ? 'bg-blue-dianne text-white' : 'bg-white text-black hover:bg-black/5')
                      }
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab panels */}
            <div className="w-full">
              {active === 'installation' && (
                <div
                  role="tabpanel"
                  id="panel-installation"
                  aria-labelledby="tab-installation"
                  className="bg-blue-dianne text-white rounded-2xl p-spacing-3xl gap-spacing-4xl relative"
                >
                  <div className="gap-spacing-2xl h-full justify-between flex flex-col">
                    <div className="grid gap-spacing-xl">
                      <h6 className="text-white">Installer une borne EVplug</h6>
                      <div className="text-white image-two-card-des m-0">
                        <p>Borne domestique avec installation standard incluse.</p>
                      </div>
                    </div>
                    <InstallationForm />
                  </div>
                </div>
              )}

              {active === 'card' && (
                <div
                  role="tabpanel"
                  id="panel-card"
                  aria-labelledby="tab-card"
                  className="bg-blue-dianne text-white rounded-2xl p-spacing-3xl gap-spacing-4xl relative"
                >
                  <div className="gap-spacing-2xl h-full justify-between flex flex-col">
                    <div className="grid gap-spacing-xl">
                      <h6 className="text-white">EVplug Card</h6>
                      <div className="text-white image-two-card-des m-0">
                        <p>Recharge a domicile pour 40 MAD/mois.</p>
                      </div>
                    </div>
                    <CardForm />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CtaBanner() {
  return (
    <section className="relative cta-banner">
      <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile relative mx-auto md:py-spacing-7xl pt-spacing-7xl md:!pb-[170px]">
        <div className="grid md:grid-flow-col gap-spacing-4xl text-white">
          <div className="bg-blue-dianne md:w-[calc(100%-65px)] xl:w-[calc(100%-178px)] rounded-2xl">
            <div className="relative z-10 p-spacing-7xl max-w-[762px]">
              <div className="grid gap-spacing-3xl w-full">
                <div className="grid gap-spacing-xl">
                  <h3 className="text-pear uppercase font-PosterCutNeue m-0 font-normal">Besoin d'aide pour choisir ?</h3>
                  <div className="m-0 link-white">
                    <p>Depuis plus de 15 ans, nous simplifions la recharge. Que vous achetiez une borne EVplug ou souscriviez a EVplug Card, vous etes entre de bonnes mains.</p>
                  </div>
                </div>
                <div className="flex gap-spacing-xl flex-wrap">
                  <a href="/home/home-charging" className="btn btn-secondary font-base">En savoir plus</a>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 rounded-2xl flex justify-center items-center md:w-[270px] md:h-[270px] xl:w-[379px] xl:h-[379px] md:absolute xl:top-[120px] xl:right-[130px] md:top-[290px] md:right-[30px]" style={{ backgroundColor: '#87B4E1' }}>
            <img src="https://podenergy.com/sites/default/files/2025-11/Pod Home Charging.svg" alt="Pod Home" className="h-[255px]" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function OrderNow() {
  const pageClasses = 'path-node page-node-type-page d-flex flex-column'

  const shell = useMemo(() => {
    const migratedShell = migrateBodyMarkup(homeBodyRaw, 'index.html')
    return splitShellBlocks(migratedShell.html)
  }, [])

  useLayoutEffect(() => {
    const htmlElement = document.documentElement
    const bodyElement = document.body
    const previousHtmlClassName = htmlElement.className
    const previousBodyClassName = bodyElement.className
    const previousTitle = document.title

    htmlElement.className = pageClasses
    bodyElement.className = pageClasses
    document.title = 'Demander un devis | EVplug'

    return () => {
      htmlElement.className = previousHtmlClassName
      bodyElement.className = previousBodyClassName
      document.title = previousTitle
    }
  }, [])

  return (
    <>
      <HtmlBlock html={shell.preRoot} />
      <div className={shell.rootClassName} data-off-canvas-main-canvas>
        <Navbar html={shell.navbar} />
        <main role="main" className="flex-grow">
          <div className="node__content">
            <section className="relative breadcrumb-section">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto pt-spacing-7xl pb-spacing-xl">
                <nav className="flex items-center flex-wrap space-x-2 text-sm" aria-label="Breadcrumb">
                  <a href="/" className="font-semibold underline hover:no-underline">Home</a>
                  <span className="font-xs">
                    <i className="fa-solid fa-angle-right" />
                  </span>
                  <span className="font-semibold">Demander un devis</span>
                </nav>
              </div>
            </section>

            <TwoCardsLayout />
            <CtaBanner />
          </div>
        </main>
        <Footer html={shell.footer} />
      </div>
    </>
  )
}
