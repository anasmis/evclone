import { Link } from 'react-router-dom'
import MirrorShell from '../MirrorShell'
import Breadcrumb from '../../components/sections/Breadcrumb'
import Hero from '../../components/sections/Hero'
import BenefitsStrip from '../../components/sections/BenefitsStrip'
import CtaBanner from '../../components/sections/CtaBanner'
import FloatingCtaForm from '../../components/common/FloatingCtaForm'
import { icons } from '../../migrated/assets/solutions/shared/icons'
import ctaImageSrc from '../../migrated/assets/solutions/shared/cta-image.svg'
import heroImg from '../../migrated/assets/installation/hero.webp'
import electriciansImg from '../../migrated/assets/solutions/hotels/story.jpeg'
import corporateImg from '../../migrated/assets/solutions/entreprise/story.jpeg'

const benefits = [
  {
    icon: icons.installation,
    title: 'Formation pratique',
    description:
      "Concue par des installateurs, pour des installateurs. Pratique, mise en service guidee et outils EVplug pour gagner du temps sur chaque chantier.",
  },
  {
    icon: icons.charger,
    title: 'Outils EVplug',
    description:
      "Application Installateur, ressources marketing et support EVplug : tout ce qu'il faut pour livrer des installations conformes et rapides.",
  },
  {
    icon: icons.profile,
    title: 'Modele partenaire',
    description:
      "Vous gardez la relation client et votre pricing. EVplug vous apporte certification, outils, support et visibilite.",
  },
  {
    icon: icons.tick,
    title: 'Garantie 5 ans*',
    description:
      "En terminant la formation, vous debloquez une garantie produit de 5 ans et l'acces aux ressources d'installateur certifie EVplug.",
  },
]

function PathCard({ tag, title, body, image, ctaTo, ctaLabel }) {
  return (
    <div className="flex flex-col md:flex-row py-spacing-7xl items-center justify-between xl:gap-spacing-9xl gap-spacing-7xl grid-block rounded-3xl bg-white border border-gray-200 p-spacing-7xl">
      <div className="md:w-6/12 w-full">
        <img className="w-full rounded-2xl object-cover" src={image} alt={title} loading="lazy" />
      </div>
      <div className="md:w-6/12 w-full">
        <div className="max-w-[480px] grid gap-spacing-3xl">
          <div className="grid gap-spacing-3xl">
            <p className="uppercase tracking-[0.2em] text-sm font-semibold m-0">{tag}</p>
            <h3 className="tracking-tight m-0">{title}</h3>
            <div className="hero-banner-des">
              <p>{body}</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-start gap-spacing-xl">
            <Link to={ctaTo} className="btn btn-primary font-base">
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TrainingHub() {
  return (
    <MirrorShell documentTitle="Formation et certification EVplug | Installateurs et entreprises">
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb current="Formation et certification" />

            <Hero
              tag="Formation EVplug"
              title="Formation et certification EVplug"
              subtitle={
                <>
                  <p>
                    <strong>
                      Deux parcours EVplug : certification installateur et formations professionnelles pour
                      entreprises.
                    </strong>
                  </p>
                  <p>
                    EVplug forme et certifie les installateurs pour la recharge a domicile, et propose des Formations
                    Professionnelles aux entreprises qui veulent qualifier leurs equipes. Notre modele partenaire vous
                    aide a livrer des installations fiables, avec des outils, un accompagnement et une mise en service
                    simples.
                  </p>
                </>
              }
              ctas={[
                { to: '/training/electricians', label: 'Parcours installateurs', variant: 'primary' },
                { to: '/training/corporate', label: 'Formations entreprises', variant: 'primary-outline' },
              ]}
              image={heroImg}
              imageAlt="Formation EVplug"
            />

            <BenefitsStrip heading="Pourquoi se former avec EVplug" items={benefits} />

            {/* Choose your path */}
            <section className="text-left-right-variant relative image-text-section bg-surface top-spacing">
              <div className="grid container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile gap-spacing-4xl image-text-block">
                <div className="w-full">
                  <div className="grid gap-spacing-4xl py-spacing-5xl border-b border-gray-200">
                    <h2 className="tracking-tight m-0">Choisissez votre parcours</h2>
                    <p className="m-0">
                      Deux offres distinctes : certification installateur EVplug ou{' '}
                      <strong>Formations Professionnelles</strong> pour les entreprises.
                    </p>
                    <div className="flex flex-wrap gap-spacing-xl">
                      <a href="#installateurs" className="btn btn-primary font-base">
                        Parcours installateurs
                      </a>
                      <a href="#entreprises" className="btn btn-secondary font-base">
                        Formations entreprises
                      </a>
                    </div>
                  </div>
                </div>

                <div id="installateurs">
                  <PathCard
                    tag="Pour les electriciens"
                    title="Parcours installateurs certifies EVplug"
                    body="Certification, outils et support pour installer, mettre en service et depanner plus vite. Ouvert a tous les electriciens certifies. Formation pratique, mise en service guidee, et outils EVplug pour gagner du temps sur chaque chantier."
                    image={electriciansImg}
                    ctaTo="/training/electricians"
                    ctaLabel="Decouvrir le parcours installateur"
                  />
                </div>

                <div id="entreprises">
                  <PathCard
                    tag="Service Entreprise"
                    title="Formations Professionnelles pour entreprises"
                    body="EVplug accompagne les entreprises avec des formations sur mesure pour les equipes techniques, HSE et operations. Modules sur la securite, la mise en service, les bonnes pratiques et le suivi des installations. Formats en ligne ou sur site, inter-entreprises ou intra-entreprise."
                    image={corporateImg}
                    ctaTo="/training/corporate"
                    ctaLabel="Decouvrir Formations Pro"
                  />
                </div>
              </div>
            </section>

            {/* Important info */}
            <section
              className="header-two relative top-spacing"
              style={{ backgroundColor: '#f5f1eb' }}
            >
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto pt-spacing-7xl pb-spacing-7xl grid gap-spacing-7xl">
                <div className="max-w-[720px] grid gap-spacing-3xl">
                  <h3 className="tracking-tight m-0">Informations importantes</h3>
                  <div className="hero-banner-des">
                    <p>
                      *La garantie de 5 ans est disponible pour les electriciens certifies verifies par EVplug et ayant
                      termine la formation complete en ligne de 2 heures.
                    </p>
                    <p>
                      <strong>Modele EVplug</strong> : certification, outils et support pour les installateurs, et{' '}
                      <strong>Formations Professionnelles</strong> pour les entreprises qui souhaitent qualifier leurs
                      equipes a la recharge EV.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <CtaBanner
              title="Commencez votre parcours EVplug"
              body="Que vous soyez electricien certifie ou responsable d'equipe en entreprise, EVplug vous accompagne avec un parcours adapte. Choisissez celui qui vous correspond."
              ctas={[
                { to: '/training/electricians', label: 'Je suis electricien', variant: 'secondary' },
                { to: '/training/corporate', label: 'Je represente une entreprise', variant: 'secondary-outline' },
              ]}
              decorImage={ctaImageSrc}
              decorBg="#87b4e1"
            />
          </div>
        </article>
      </div>
      <FloatingCtaForm
        buttonLabel="Etre rappele"
        title="Parlons de votre projet de formation"
        subtitle="Indiquez-nous votre profil et vos besoins, un conseiller EVplug vous recontacte sous 24h."
        interestOptions={[
          'Certification installateur',
          'Formation entreprise',
          'Devis sur mesure',
          'Autre',
        ]}
        accentColor="#c8d72d"
      />
    </MirrorShell>
  )
}
