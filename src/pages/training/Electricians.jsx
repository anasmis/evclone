import MirrorShell from '../MirrorShell'
import Breadcrumb from '../../components/sections/Breadcrumb'
import Hero from '../../components/sections/Hero'
import BenefitsStrip from '../../components/sections/BenefitsStrip'
import CtaBanner from '../../components/sections/CtaBanner'
import FloatingCtaForm from '../../components/common/FloatingCtaForm'
import { submitTrainingRequest } from '../../lib/api/strapi'
import BookingCalendar from '../../components/common/BookingCalendar'
import { icons } from '../../migrated/assets/solutions/shared/icons'
import ctaImageSrc from '../../migrated/assets/solutions/shared/cta-image.svg'
import heroImg from '../../migrated/assets/installation/hero.webp'
import stepImg1 from '../../migrated/assets/installation/step-img-1.jpeg'
import stepImg2 from '../../migrated/assets/installation/step-img-2.jpeg'

const openInstallerForm = () => {
  window.dispatchEvent(new CustomEvent('floating-cta-form:open'))
}

const levels = [
  {
    number: '01',
    name: 'Niveau 1 — Initiation',
    duration: '2h en ligne',
    audience: 'Électriciens certifiés découvrant la recharge VE',
    summary:
      'Les fondamentaux de la recharge à domicile, la gamme EVplug et le cadre réglementaire au Maroc.',
    bullets: [
      'Vocabulaire et bases techniques de la recharge VE',
      'Tour de la gamme EVplug et compatibilités véhicules',
      'Sécurité, normes et points de vigilance chantier',
    ],
  },
  {
    number: '02',
    name: 'Niveau 2 — Confirmé',
    duration: '1 journée pratique',
    audience: 'Installateurs avec premières poses réalisées',
    summary:
      "Pose, mise en service et paramétrage de la borne EVplug pas à pas avec l'application Installateur.",
    bullets: [
      'Dimensionnement et raccordement au tableau',
      "Mise en service guidée avec l'application EVplug",
      'Diagnostic des incidents fréquents et reprise rapide',
    ],
  },
  {
    number: '03',
    name: 'Niveau 3 — Expert',
    duration: '2 jours avancées',
    audience: 'Installateurs réguliers souhaitant la certification complète',
    summary:
      'Configurations avancées (délestage, supervision, multi-bornes), service après-vente et garantie 5 ans.',
    bullets: [
      'Délestage dynamique et intégration énergie',
      'Déploiements multi-bornes en copropriété et entreprise',
      'SAV, télé-diagnostic et garantie produit 5 ans*',
    ],
  },
]

const benefits = [
  {
    icon: icons.installation,
    title: 'Formation pratique',
    description:
      "Conçue par des installateurs, pour des installateurs. Pratique, mise en service guidée et outils EVplug pour gagner du temps.",
  },
  {
    icon: icons.profile,
    title: 'Vous gardez vos clients',
    description:
      'Vous gardez la relation client et votre pricing. EVplug apporte outils, support et visibilité.',
  },
  {
    icon: icons.tick,
    title: 'Garantie produit 5 ans*',
    description:
      "En terminant la formation, vous débloquez une garantie produit de 5 ans pour vos clients.",
  },
  {
    icon: icons.sendFeedback,
    title: 'Ressources marketing',
    description:
      "Accès aux ressources marketing d'installateur certifié EVplug pour développer votre activité.",
  },
]

export default function Electricians() {
  return (
    <MirrorShell documentTitle="Devenir installateur certifié EVplug | Formation électriciens">
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb
              current="Installateurs"
              trail={[{ to: '/training', label: 'Formation' }]}
            />

            <Hero
              tag="Pour les électriciens"
              title="Devenez installateur certifié EVplug"
              subtitle={
                <>
                  <p>
                    <strong>
                      Proposez à vos clients une solution de recharge à domicile fiable, installée sans prise de tête.
                    </strong>
                  </p>
                  <p>
                    La formation EVplug pour installateurs domestiques est conçue par des installateurs, pour des
                    installateurs, et elle est ouverte à tous les électriciens certifiés.
                  </p>
                </>
              }
              ctas={[
                { onClick: openInstallerForm, label: 'Réserver une session installateur', variant: 'primary' },
                { to: '/training', label: 'Voir les deux parcours', variant: 'primary-outline' },
              ]}
              image={heroImg}
              imageAlt="Devenir installateur certifié EVplug"
            />

            <BenefitsStrip heading="Ce que vous obtenez" items={benefits} />

            {/* Inscriptions ouvertes + Modèle partenaire */}
            <section className="text-left-right-variant relative image-text-section bg-surface top-spacing">
              <div className="grid container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile gap-spacing-4xl image-text-block">
                <div className="w-full">
                  <div className="grid gap-spacing-3xl py-spacing-5xl">
                    <h2 className="tracking-tight m-0">Parcours installateurs certifiés EVplug</h2>
                    <p className="m-0">
                      Certification, outils et support pour installer, mettre en service et dépanner plus vite.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row py-spacing-7xl items-center justify-between xl:gap-spacing-9xl gap-spacing-7xl grid-block">
                  <div className="md:w-6/12 w-full">
                    <img className="w-full rounded-2xl object-cover" src={stepImg1} alt="Inscriptions ouvertes" loading="lazy" />
                  </div>
                  <div className="md:w-6/12 w-full">
                    <div className="max-w-[480px] grid gap-spacing-3xl">
                      <h3 className="tracking-tight m-0">Inscriptions ouvertes</h3>
                      <div className="hero-banner-des">
                        <p>
                          Vous voulez proposer à vos clients une solution de recharge à domicile fiable, et l&rsquo;installer
                          sans prise de tête ?
                        </p>
                        <p>
                          La formation EVplug pour installateurs domestiques est conçue par des installateurs, pour des
                          installateurs, et elle est ouverte à tous les électriciens certifiés.
                        </p>
                        <p>
                          Au programme : formation pratique, mise en service guidée, et outils EVplug pour gagner du
                          temps sur chaque chantier.
                        </p>
                      </div>
                      <div className="flex justify-start gap-spacing-xl">
                        <button
                          type="button"
                          onClick={openInstallerForm}
                          className="btn btn-primary font-base"
                        >
                          Réserver une session
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row py-spacing-7xl items-center justify-between xl:gap-spacing-9xl gap-spacing-7xl grid-block md:flex-row-reverse rounded-3xl bg-white border border-gray-200 p-spacing-7xl">
                  <div className="md:w-6/12 w-full">
                    <img className="w-full rounded-2xl object-cover" src={stepImg2} alt="Modèle partenaire EVplug" loading="lazy" />
                  </div>
                  <div className="md:w-6/12 w-full">
                    <div className="max-w-[480px] grid gap-spacing-3xl">
                      <h3 className="tracking-tight m-0">Le modèle partenaire EVplug</h3>
                      <div className="hero-banner-des">
                        <ul>
                          <li>
                            EVplug vous forme, certifie et vous équipe pour des installations conformes et rapides.
                          </li>
                          <li>
                            Vous gardez la relation client et votre pricing, EVplug vous apporte outils, support et
                            visibilité.
                          </li>
                          <li>
                            En terminant la formation, vous débloquez une <strong>garantie produit de 5 ans</strong> et
                            l&rsquo;accès aux <strong>ressources marketing d&rsquo;installateur certifié EVplug</strong>.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Niveaux */}
            <section className="relative bg-white top-spacing" id="niveaux">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
                <div className="grid gap-spacing-6xl">
                  <div className="view-header text-center max-w-[720px] mx-auto">
                    <div className="heading-block grid gap-spacing-3xl">
                      <span className="inline-flex items-center gap-spacing-sm px-spacing-md py-spacing-sm rounded-full bg-lime text-black text-sm font-semibold w-fit mx-auto">
                        Parcours en 3 niveaux
                      </span>
                      <h2 className="tracking-tight m-0">Les niveaux de certification</h2>
                      <p>
                        Progressez à votre rythme : chaque niveau débloque de nouveaux droits, des
                        outils EVplug supplémentaires et, au niveau 3, la garantie produit 5 ans*.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-spacing-4xl">
                    {levels.map((lvl) => (
                      <div
                        key={lvl.number}
                        className="bg-surface rounded-2xl p-spacing-6xl border border-gray-200 grid gap-spacing-3xl"
                      >
                        <div className="flex items-start justify-between gap-spacing-xl">
                          <span className="font-PosterCutNeue text-5xl leading-none text-black">
                            {lvl.number}
                          </span>
                          <span className="text-xs uppercase tracking-[0.15em] font-semibold bg-lime text-black px-spacing-md py-spacing-xs rounded-full">
                            {lvl.duration}
                          </span>
                        </div>
                        <div className="grid gap-spacing-sm">
                          <h3 className="m-0 tracking-tight text-2xl">{lvl.name}</h3>
                          <p className="uppercase tracking-[0.15em] text-xs font-semibold text-gray-600 m-0">
                            {lvl.audience}
                          </p>
                        </div>
                        <p className="m-0">{lvl.summary}</p>
                        <ul className="m-0 p-0 list-none grid gap-spacing-sm">
                          {lvl.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-spacing-sm">
                              <img
                                src={icons.tick}
                                alt=""
                                width={12}
                                height={12}
                                className="mt-1 shrink-0"
                              />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center pt-spacing-3xl">
                    <a href="#calendrier" className="btn btn-primary font-base">
                      Voir le calendrier
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <BookingCalendar
              formationKey="installer"
              title="Réservez votre session installateur"
              subtitle="Choisissez une date pour voir les créneaux de formation disponibles."
              accentColor="#c8d72d"
            />

            {/* Important info */}
            <section
              className="header-two relative top-spacing"
              style={{ backgroundColor: '#f5f1eb' }}
            >
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto pt-spacing-7xl pb-spacing-7xl">
                <div className="max-w-[720px] grid gap-spacing-3xl">
                  <h3 className="tracking-tight m-0">Informations importantes</h3>
                  <div className="hero-banner-des">
                    <p>
                      *La garantie de 5 ans est disponible pour les électriciens certifiés vérifiés par EVplug et ayant
                      terminé la formation complète en ligne de 2 heures. Conditions générales applicables.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <CtaBanner
              title="Prêt à devenir installateur certifié ?"
              body="Réservez votre session de formation EVplug. Notre équipe vous accompagne, de la certification à vos premiers chantiers."
              ctas={[
                { onClick: openInstallerForm, label: 'Réserver une session', variant: 'secondary' },
                { to: '/contact-us', label: 'Poser une question', variant: 'secondary-outline' },
              ]}
              decorImage={ctaImageSrc}
              decorBg="#87b4e1"
            />
          </div>
        </article>
      </div>
      <FloatingCtaForm
        buttonLabel="Devenir installateur"
        title="Certification installateur EVplug"
        subtitle="Réservez une session ou posez votre question : un conseiller EVplug vous recontacte sous 24h."
        interestOptions={[
          'Réserver une session installateur',
          'Garantie produit 5 ans',
          'Ressources marketing',
          'Autre',
        ]}
        defaultInterest="Réserver une session installateur"
        accentColor="#c8d72d"
        submitFn={submitTrainingRequest}
      />
    </MirrorShell>
  )
}
