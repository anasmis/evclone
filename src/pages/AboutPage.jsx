import { Link } from 'react-router-dom'
import MirrorShell from './MirrorShell'
import Breadcrumb from '../components/sections/Breadcrumb'
import Hero from '../components/sections/Hero'
import heroImg from '../migrated/assets/about/hero.svg'
import iconSchedule from '../migrated/assets/about/icon-schedule.svg'
import iconVehicle from '../migrated/assets/about/icon-vehicle.svg'
import iconLocation from '../migrated/assets/about/icon-location.svg'

const keyPoints = [
  { icon: iconSchedule, alt: 'Fondé en 2021', title: 'Fondé en 2021' },
  { icon: iconVehicle, alt: '6 000 alimentés... et ça continue', title: '6 000 alimentés... et ça continue' },
  { icon: iconLocation, alt: 'Plus de 2 500 bornes VE installées', title: 'Plus de 2 500 bornes VE installées' },
]

export default function AboutPage() {
  return (
    <MirrorShell documentTitle="Notre mission | EVplug">
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb current="Notre mission" />

            <Hero
              title="Trust and love your charging experience"
              subtitle={<p>La recharge pour VE qui fonctionne pour tous.</p>}
              image={heroImg}
              imageAlt="Accélérer la mobilité électrique au Maroc"
            />

            {/* Key points (Points clés) */}
            <section className="bg-white easy-to-setup relative py-spacing-7xl rounded-b-4xl">
              <div className="container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile">
                <div className="grid gap-spacing-6xl">
                  <h3 className="text-center tracking-tight m-0">Points clés</h3>
                  <div className="flex mx-auto flex-wrap xl:flex-nowrap xl:gap-spacing-8xl gap-spacing-6xl justify-center items-start">
                    {keyPoints.map((p) => (
                      <div key={p.title} className="w-full grid gap-spacing-4xl text-center md:max-w-[276px] mx-auto">
                        <div className="w-16 h-16 bg-lime rounded-full flex items-center justify-center mx-auto p-3">
                          <img className="mx-auto" src={p.icon} alt={p.alt} />
                        </div>
                        <div className="grid gap-spacing-xl">
                          <div className="title">
                            <h6>{p.title}</h6>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* À propos de nous */}
            <section className="text-left-right-variant relative image-text-section bg-surface top-spacing">
              <div className="grid container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile gap-spacing-4xl image-text-block">
                <div className="flex flex-col md:flex-row py-spacing-7xl items-center justify-between xl:gap-spacing-9xl gap-spacing-7xl grid-block">
                  <div className="w-full">
                    <div className="max-w-190 grid gap-spacing-3xl">
                      <div className="grid gap-spacing-3xl">
                        <h3 className="tracking-tight m-0">À propos de nous</h3>
                        <div className="hero-banner-des">
                          <p>
                            Nous sommes EVplug — l'un des principaux fournisseurs de recharge pour véhicules
                            électriques au Maroc, de confiance pour plus d'un quart de mille de clients et alimentant
                            chaque jour des millions de kilomètres.
                          </p>
                          <p>
                            Créés en 2021 sous le nom d'EVplug, nous avons aidé les automobilistes à passer à
                            l'électrique dès les premières années de déploiement des véhicules électriques.
                            Aujourd'hui, nous accompagnons la transition vers un avenir énergétique plus intelligent
                            grâce à notre expérience technique et notre réseau d'infrastructures.
                          </p>
                          <p>
                            Notre taille et notre présence nous permettent de gérer la demande de manière à bénéficier
                            à la fois au réseau électrique et à nos clients. Cette combinaison d'expertise,
                            d'infrastructures et de connaissance client fait de nous un acteur prêt et adapté à la
                            transition énergétique.
                          </p>
                          <p>
                            Alors que le Maroc progresse vers un système énergétique plus propre et plus flexible,
                            EVplug est prêt à répondre aux besoins en recharge intelligente, à réduire les coûts et à
                            rendre l'énergie propre accessible à tous.
                          </p>
                          <p>
                            Nous donnons aux particuliers et aux collectivités les moyens de se lancer dans
                            l'électrification en toute confiance.
                          </p>
                          <hr />
                          <p>
                            <strong>Informations de contact</strong>
                          </p>
                          <p>
                            Boulevard Zoulikha Nasri, Florida Center Park 2, Etage 2, Bureau N23, Sidi Maarouf,
                            Casablanca
                          </p>
                          <p>
                            <a href="mailto:support@evplug.com">support@evplug.com</a>
                          </p>
                          <p>
                            Fixe : +212 5 20 00 31 20
                            <br />
                            Mobile : +212 6 65 25 49 05
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row py-spacing-7xl items-center justify-between xl:gap-spacing-9xl gap-spacing-7xl grid-block">
                  <div className="w-full">
                    <div className="max-w-190 grid gap-spacing-3xl">
                      <div className="grid gap-spacing-3xl">
                        <h3 className="tracking-tight m-0">Trust and love your charging experience</h3>
                        <div className="hero-banner-des">
                          <p>
                            <strong>Accélérer la mobilité électrique au Maroc</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* APIME */}
            <section className="relative top-spacing" style={{ backgroundColor: '#123d33' }}>
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
                <div className="grid md:grid-cols-2 gap-spacing-6xl items-center">
                  <div className="grid gap-spacing-3xl">
                    <span className="inline-flex items-center gap-spacing-sm px-spacing-md py-spacing-sm rounded-full bg-lime text-black text-sm font-semibold w-fit">
                      Engagement filière
                    </span>
                    <h2 className="tracking-tight m-0" style={{ color: '#ffffff' }}>
                      EVplug, vice-président de l'APIME
                    </h2>
                    <div className="hero-banner-des" style={{ color: '#ffffff' }}>
                      <p>
                        EVplug occupe la vice-présidence de l'APIME, l'association professionnelle
                        marocaine dédiée à la mobilité électrique. À ce titre, nous contribuons à
                        structurer la filière, définir des standards techniques et accélérer le
                        déploiement des infrastructures de recharge au Maroc.
                      </p>
                      <p>
                        Notre expérience opérationnelle alimente directement les groupes de travail
                        de l'association : choix techniques, exigences de sécurité, formation des
                        installateurs et concertation avec les pouvoirs publics.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-spacing-xl">
                      <Link to="/about/APIME" className="btn btn-primary font-base">
                        Notre rôle à l'APIME
                      </Link>
                    </div>
                  </div>
                  <div>
                    <div
                      className="rounded-3xl p-spacing-7xl text-center"
                      style={{ backgroundColor: '#0d2d25' }}
                    >
                      <p
                        className="font-PosterCutNeue text-7xl leading-none m-0"
                        style={{ color: '#c8d72d' }}
                      >
                        APIME.
                      </p>
                      <p className="mt-spacing-3xl m-0" style={{ color: '#ffffff' }}>
                        Association professionnelle intersectorielle pour la mobilité électrique au
                        Maroc.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </article>
      </div>
    </MirrorShell>
  )
}
