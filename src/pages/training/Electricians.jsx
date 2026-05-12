import MirrorShell from '../MirrorShell'
import Breadcrumb from '../../components/sections/Breadcrumb'
import Hero from '../../components/sections/Hero'
import BenefitsStrip from '../../components/sections/BenefitsStrip'
import CtaBanner from '../../components/sections/CtaBanner'
import FloatingCtaForm from '../../components/common/FloatingCtaForm'
import { icons } from '../../migrated/assets/solutions/shared/icons'
import ctaImageSrc from '../../migrated/assets/solutions/shared/cta-image.svg'
import heroImg from '../../migrated/assets/installation/hero.png'
import stepImg1 from '../../migrated/assets/installation/step-img-1.webp'
import stepImg2 from '../../migrated/assets/installation/step-img-2.webp'

const openInstallerForm = () => {
  window.dispatchEvent(new CustomEvent('floating-cta-form:open'))
}

const benefits = [
  {
    icon: icons.installation,
    title: 'Formation pratique',
    description:
      "Concue par des installateurs, pour des installateurs. Pratique, mise en service guidee et outils EVplug pour gagner du temps.",
  },
  {
    icon: icons.profile,
    title: 'Vous gardez vos clients',
    description:
      'Vous gardez la relation client et votre pricing. EVplug apporte outils, support et visibilite.',
  },
  {
    icon: icons.tick,
    title: 'Garantie produit 5 ans*',
    description:
      "En terminant la formation, vous debloquez une garantie produit de 5 ans pour vos clients.",
  },
  {
    icon: icons.sendFeedback,
    title: 'Ressources marketing',
    description:
      "Acces aux ressources marketing d'installateur certifie EVplug pour developper votre activite.",
  },
]

export default function Electricians() {
  return (
    <MirrorShell documentTitle="Devenir installateur certifie EVplug | Formation electriciens">
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb
              current="Installateurs"
              trail={[{ to: '/training', label: 'Formation' }]}
            />

            <Hero
              tag="Pour les electriciens"
              title="Devenez installateur certifie EVplug"
              subtitle={
                <>
                  <p>
                    <strong>
                      Proposez a vos clients une solution de recharge a domicile fiable, installee sans prise de tete.
                    </strong>
                  </p>
                  <p>
                    La formation EVplug pour installateurs domestiques est concue par des installateurs, pour des
                    installateurs, et elle est ouverte a tous les electriciens certifies.
                  </p>
                </>
              }
              ctas={[
                { onClick: openInstallerForm, label: 'Reserver une session installateur', variant: 'primary' },
                { to: '/training', label: 'Voir les deux parcours', variant: 'primary-outline' },
              ]}
              image={heroImg}
              imageAlt="Devenir installateur certifie EVplug"
            />

            <BenefitsStrip heading="Ce que vous obtenez" items={benefits} />

            {/* Inscriptions ouvertes + Modele partenaire */}
            <section className="text-left-right-variant relative image-text-section bg-surface top-spacing">
              <div className="grid container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile gap-spacing-4xl image-text-block">
                <div className="w-full">
                  <div className="grid gap-spacing-3xl py-spacing-5xl">
                    <h2 className="tracking-tight m-0">Parcours installateurs certifies EVplug</h2>
                    <p className="m-0">
                      Certification, outils et support pour installer, mettre en service et depanner plus vite.
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
                          Vous voulez proposer a vos clients une solution de recharge a domicile fiable, et l&rsquo;installer
                          sans prise de tete ?
                        </p>
                        <p>
                          La formation EVplug pour installateurs domestiques est concue par des installateurs, pour des
                          installateurs, et elle est ouverte a tous les electriciens certifies.
                        </p>
                        <p>
                          Au programme : formation pratique, mise en service guidee, et outils EVplug pour gagner du
                          temps sur chaque chantier.
                        </p>
                      </div>
                      <div className="flex justify-start gap-spacing-xl">
                        <button
                          type="button"
                          onClick={openInstallerForm}
                          className="btn btn-primary font-base"
                        >
                          Reserver une session
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row py-spacing-7xl items-center justify-between xl:gap-spacing-9xl gap-spacing-7xl grid-block md:flex-row-reverse rounded-3xl bg-white border border-gray-200 p-spacing-7xl">
                  <div className="md:w-6/12 w-full">
                    <img className="w-full rounded-2xl object-cover" src={stepImg2} alt="Modele partenaire EVplug" loading="lazy" />
                  </div>
                  <div className="md:w-6/12 w-full">
                    <div className="max-w-[480px] grid gap-spacing-3xl">
                      <h3 className="tracking-tight m-0">Le modele partenaire EVplug</h3>
                      <div className="hero-banner-des">
                        <ul>
                          <li>
                            EVplug vous forme, certifie et vous equipe pour des installations conformes et rapides.
                          </li>
                          <li>
                            Vous gardez la relation client et votre pricing, EVplug vous apporte outils, support et
                            visibilite.
                          </li>
                          <li>
                            En terminant la formation, vous debloquez une <strong>garantie produit de 5 ans</strong> et
                            l&rsquo;acces aux <strong>ressources marketing d&rsquo;installateur certifie EVplug</strong>.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

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
                      *La garantie de 5 ans est disponible pour les electriciens certifies verifies par EVplug et ayant
                      termine la formation complete en ligne de 2 heures. Conditions generales applicables.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <CtaBanner
              title="Pret a devenir installateur certifie ?"
              body="Reservez votre session de formation EVplug. Notre equipe vous accompagne, de la certification a vos premiers chantiers."
              ctas={[
                { onClick: openInstallerForm, label: 'Reserver une session', variant: 'secondary' },
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
        subtitle="Reservez une session ou posez votre question : un conseiller EVplug vous recontacte sous 24h."
        interestOptions={[
          'Reserver une session installateur',
          'Garantie produit 5 ans',
          'Ressources marketing',
          'Autre',
        ]}
        defaultInterest="Reserver une session installateur"
        accentColor="#c8d72d"
      />
    </MirrorShell>
  )
}
