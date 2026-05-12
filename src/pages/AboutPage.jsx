import MirrorShell from './MirrorShell'
import Breadcrumb from '../components/sections/Breadcrumb'
import Hero from '../components/sections/Hero'
import heroImg from '../migrated/assets/about/hero.svg'
import iconSchedule from '../migrated/assets/about/icon-schedule.svg'
import iconVehicle from '../migrated/assets/about/icon-vehicle.svg'
import iconLocation from '../migrated/assets/about/icon-location.svg'
import aboutUsImg from '../migrated/assets/about/about-us.webp'
import electromobiliteImg from '../migrated/assets/about/electromobilite.webp'
import teamLogo from '../migrated/assets/layout/logo.webp'

const keyPoints = [
  { icon: iconSchedule, alt: 'Fonde en 2021', title: 'Fonde en 2021' },
  { icon: iconVehicle, alt: '6 000 alimentes... et ca continue', title: '6 000 alimentes... et ca continue' },
  { icon: iconLocation, alt: 'Plus de 2 500 bornes VE installees', title: 'Plus de 2 500 bornes VE installees' },
]

const leaders = [
  { name: 'Walid Ansrah', bio: 'bio', image: teamLogo },
  { name: 'Mohamed Oukheyi', bio: 'bio', image: teamLogo },
  { name: 'Said Oukheyi', bio: 'bio', image: teamLogo },
]

const teams = [
  'Commerciales',
  'Marketing',
  'Coordinations',
  'Techniques',
  'Supports',
  'Administratifs',
]

export default function AboutPage() {
  return (
    <MirrorShell documentTitle="Notre mission | EVplug">
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb current="Notre mission" />

            <Hero
              title="Accelerer la mobilite electrique au Maroc"
              subtitle={<p>La recharge pour VE qui fonctionne pour tous.</p>}
              image={heroImg}
              imageAlt="Accelerer la mobilite electrique au Maroc"
            />

            {/* Key points (Points cles) */}
            <section className="bg-white easy-to-setup relative py-spacing-7xl rounded-b-4xl">
              <div className="container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile">
                <div className="grid gap-spacing-6xl">
                  <h3 className="text-center tracking-tight m-0">Points cles</h3>
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

            {/* A propos de nous */}
            <section className="text-left-right-variant relative image-text-section bg-surface top-spacing">
              <div className="grid container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile gap-spacing-4xl image-text-block">
                <div className="flex flex-col md:flex-row py-spacing-7xl items-center justify-between xl:gap-spacing-9xl gap-spacing-7xl grid-block">
                  <div className="md:w-6/12 w-full">
                    <img className="w-full rounded-2xl" src={aboutUsImg} alt="A propos de nous" />
                  </div>
                  <div className="md:w-6/12 w-full">
                    <div className="max-w-[480px] grid gap-spacing-3xl">
                      <div className="grid gap-spacing-3xl">
                        <h3 className="tracking-tight m-0">A propos de nous</h3>
                        <div className="hero-banner-des">
                          <p>
                            Nous sommes EVplug — l'un des principaux fournisseurs de recharge pour vehicules
                            electriques au Maroc, de confiance pour plus d'un quart de mille de clients et alimentant
                            chaque jour des millions de kilometres.
                          </p>
                          <p>
                            Crees en 2021 sous le nom d'EVplug, nous avons aide les automobilistes a passer a
                            l'electrique des les premieres annees de deploiement des vehicules electriques.
                            Aujourd'hui, nous accompagnons la transition vers un avenir energetique plus intelligent
                            grace a notre experience technique et notre reseau d'infrastructures.
                          </p>
                          <p>
                            Notre taille et notre presence nous permettent de gerer la demande de maniere a beneficier
                            a la fois au reseau electrique et a nos clients. Cette combinaison d'expertise,
                            d'infrastructures et de connaissance client fait de nous un acteur pret et adapte a la
                            transition energetique.
                          </p>
                          <p>
                            Alors que le Maroc progresse vers un systeme energetique plus propre et plus flexible,
                            EVplug est pret a repondre aux besoins en recharge intelligente, a reduire les couts et a
                            rendre l'energie propre accessible a tous.
                          </p>
                          <p>
                            Nous donnons aux particuliers et aux collectivites les moyens de se lancer dans
                            l'electrification en toute confiance.
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

                <div className="flex flex-col md:flex-row py-spacing-7xl items-center justify-between xl:gap-spacing-9xl gap-spacing-7xl grid-block md:flex-row-reverse">
                  <div className="md:w-6/12 w-full">
                    <img className="w-full rounded-2xl" src={electromobiliteImg} alt="L'electromobilite pour tous" />
                  </div>
                  <div className="md:w-6/12 w-full">
                    <div className="max-w-[480px] grid gap-spacing-3xl">
                      <div className="grid gap-spacing-3xl">
                        <h3 className="tracking-tight m-0">L'electromobilite pour tous</h3>
                        <div className="hero-banner-des">
                          <p>
                            <strong>Accelerer la mobilite electrique au Maroc</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Notre equipe */}
            <section className="bg-white relative py-spacing-7xl">
              <div className="container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile">
                <div className="grid gap-spacing-6xl">
                  <div className="grid gap-spacing-2xl text-center">
                    <h3 className="tracking-tight m-0">Notre equipe</h3>
                    <p className="hero-banner-des max-w-[640px] mx-auto">
                      Une equipe engagee pour accelerer la mobilite electrique au Maroc.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-spacing-6xl">
                    {leaders.map((member) => (
                      <div key={member.name} className="grid gap-spacing-3xl text-center">
                        <div className="w-40 h-40 rounded-full bg-surface mx-auto flex items-center justify-center overflow-hidden p-spacing-3xl">
                          <img className="w-full h-full object-contain" src={member.image} alt={member.name} />
                        </div>
                        <div className="grid gap-spacing-xs">
                          <h5 className="m-0">{member.name}</h5>
                          <p className="hero-banner-des m-0">{member.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-spacing-3xl mt-spacing-4xl">
                    <h4 className="tracking-tight m-0 text-center">Les equipes</h4>
                    <div className="flex flex-wrap justify-center gap-spacing-2xl">
                      {teams.map((team) => (
                        <span
                          key={team}
                          className="px-spacing-2xl py-spacing-md rounded-full bg-lime text-foreground font-medium"
                        >
                          {team}
                        </span>
                      ))}
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
