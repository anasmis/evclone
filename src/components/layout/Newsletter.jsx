import { useState } from 'react'
import { subscribeNewsletter } from '../../lib/api/strapi'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    const value = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('Veuillez saisir une adresse e-mail valide.')
      setStatus('error')
      return
    }
    setError('')
    setStatus('submitting')
    try {
      await subscribeNewsletter(value)
      setStatus('success')
      setEmail('')
    } catch (err) {
      setError(err?.message || "Erreur lors de l'inscription.")
      setStatus('error')
    }
  }

  return (
    <section className="newsletter-section relative bg-blue-dianne text-white">
      <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto py-spacing-7xl xl:py-spacing-9xl">
        <div className="grid xl:grid-cols-2 gap-spacing-6xl xl:gap-spacing-9xl items-center">
          <div className="grid gap-spacing-2xl max-w-[520px]">
            <span className="inline-flex items-center gap-spacing-sm px-spacing-md py-spacing-sm rounded-full bg-lime text-black font-semibold font-sm w-fit">
              Newsletter EVplug
            </span>
            <h3 className="m-0 text-pear font-PosterCutNeue uppercase font-normal font-4xl xl:font-6xl tracking-tight">
              Restez branche sur la mobilite electrique.
            </h3>
            <p className="m-0 font-lg text-white/85">
              Conseils pratiques, nouveautes produits et actualites du reseau EVplug au Maroc.
              Un e-mail par mois, jamais plus.
            </p>
          </div>

          <form
            onSubmit={submit}
            noValidate
            className="grid gap-spacing-xl w-full max-w-[560px] xl:ml-auto"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Adresse e-mail
            </label>
            <div className="flex flex-col sm:flex-row gap-spacing-md bg-white rounded-2xl p-spacing-sm">
              <input
                id="newsletter-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (status !== 'idle') setStatus('idle')
                }}
                aria-invalid={status === 'error'}
                aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
                className="flex-1 bg-transparent text-black px-spacing-xl py-spacing-md font-base outline-none placeholder:text-gray"
                required
              />
              <button
                type="submit"
                className="btn btn-primary font-base whitespace-nowrap"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Inscription...' : "S'inscrire"}
              </button>
            </div>

            {status === 'error' && (
              <p id="newsletter-error" className="font-sm text-pear m-0" role="alert">
                {error}
              </p>
            )}
            {status === 'success' && (
              <p className="font-sm text-pear m-0" role="status">
                Merci ! Votre inscription a bien ete enregistree.
              </p>
            )}

            <p className="font-xs text-white/70 m-0">
              En vous inscrivant, vous acceptez de recevoir des communications d&apos;EVplug.
              Vous pouvez vous desinscrire a tout moment.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
