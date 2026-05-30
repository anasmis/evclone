import { Link } from 'react-router-dom'
import MirrorShell from './MirrorShell'
import Breadcrumb from '../components/sections/Breadcrumb'
import Hero from '../components/sections/Hero'
import Accordion from '../components/sections/Accordion'
import StepsList from '../components/sections/StepsList'
import heroImg from '../migrated/assets/installation/hero.webp'
import stepImg1 from '../migrated/assets/installation/step-img-1.jpeg'
import stepImg2 from '../migrated/assets/installation/step-img-2.jpeg'
import iconHome from '../migrated/assets/installation/icon-home.svg'
import iconInstallation from '../migrated/assets/installation/icon-installation.svg'
import standardImg1 from '../migrated/assets/installation/standard-img-1.jpeg'
import standardImg2 from '../migrated/assets/installation/standard-img-2.jpeg'
import spanner from '../migrated/assets/installation/spanner.svg'

const steps = [
  {
    title: 'Demande et etude technique',
    body:
      "Apres votre demande en ligne, un conseiller EVplug analyse votre configuration electrique, votre emplacement de stationnement et vos usages afin de determiner la borne et le type de pose les plus adaptes a votre domicile.",
  },
  {
    title: 'Devis et planification',
    body:
      "Apres etude, nous confirmons votre eligibilite au forfait standard. Plus de 90 % des clients en beneficient. Si votre configuration necessite des travaux supplementaires, nous vous remettons un devis transparent et sans engagement. Une fois valide, nous planifions l'intervention a la date qui vous convient.",
  },
  {
    title: 'Installation',
    body:
      "A la date convenue, un technicien certifie EVplug se deplace a votre domicile pour poser et raccorder votre borne selon les normes en vigueur. L'intervention dure generalement entre 2 et 4 heures. Avant de partir, le technicien vous explique le fonctionnement de la borne et vous accompagne sur l'application EVplug.",
  },
]

const standardItems = [
  {
    title: 'Fixation de la borne',
    body:
      "Nous determinons ensemble l'emplacement le plus pratique, puis fixons la borne sur un support permanent adequat (mur en briques, paroi de garage, etc.) en respectant vos contraintes et les normes de securite electrique.",
  },
  {
    title: 'Cablage',
    body:
      "Jusqu'a 15 metres de cable de qualite pour relier votre borne a l'alimentation electrique principale.",
  },
  {
    title: 'Goulotte de protection',
    body:
      "Jusqu'a 3 metres de goulotte entre votre compteur electrique et la paroi exterieure, pour un passage de cable propre et discret a l'interieur de votre logement.",
  },
  {
    title: 'Protection electrique',
    body:
      "Pose d'un tableau de protection supplementaire si necessaire, avec disjoncteur de type B ou C et differentiel de type A (ou RCBO equivalent), conformement aux normes electriques en vigueur.",
  },
  {
    title: 'Clients avec Carte EVplug',
    body:
      "Pour beneficier des fonctionnalites de la Carte EVplug, une connexion Wi-Fi stable est requise a l'emplacement d'installation. Elle permet la programmation intelligente des sessions de recharge, la supervision a distance et la reception automatique des mises a jour logicielles.",
  },
]

const faqItems = [
  {
    q: "Que se passe-t-il si mon installation n'est pas standard ?",
    a: "Si votre configuration necessite des travaux au-dela du forfait standard (par exemple plus de 15 m de cable, genie civil ou mise a niveau du tableau electrique), nous vous remettons un devis clair et sans engagement pour les couts additionnels. Si vous ne souhaitez pas donner suite, aucun frais ne vous est facture pour l'etude.",
  },
  {
    q: 'Peut-on brancher la borne EVplug sur une prise domestique ordinaire ?',
    a: "Non. Une borne de recharge EVplug doit etre raccordee directement au tableau electrique pour delivrer jusqu'a 7,4 kW. Brancher une borne sur une prise domestique standard n'est pas adapte et peut etre dangereux. Notre technicien vous conseille sur le raccordement optimal lors de la visite technique.",
  },
  {
    q: "Conditions generales d'installation",
    a: "Pour consulter les conditions generales de l'installation standard, rendez-vous sur notre page des conditions de vente de borne a domicile.",
  },
  {
    q: "Combien de temps dure l'installation d'une borne EVplug a domicile ?",
    a: "Une installation standard est realisee en 2 a 4 heures. Pour les configurations specifiques, notre equipe vous communique le delai estime apres etude technique, avant tout engagement.",
  },
]

const faqAccordionItems = faqItems.map(({ q, a }) => ({ title: q, body: a }))

export default function Installation() {
  return (
    <MirrorShell documentTitle="Installation de bornes | EVplug Maroc">
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb current="Installation" />

            <Hero
              title="Installation de bornes EVplug"
              subtitle={
                <>
                  <p>
                    <strong>Installation de borne EVplug, realisee par des techniciens certifies.</strong>
                  </p>
                  <p>
                    Notre reseau de partenaires installateurs intervient partout au Maroc pour poser votre borne dans
                    les regles de l'art. Le forfait standard EVplug couvre plus de 90 % des configurations et est
                    concu pour etre simple, rapide et fiable, sans mauvaise surprise.&nbsp;
                  </p>
                </>
              }
              ctas={[
                { to: '/home/home-charging', label: 'Decouvrir la recharge a domicile', variant: 'primary' },
                { href: 'https://www.maborneelectrique.ma/', label: 'Voir le catalogue', variant: 'primary-outline', external: true },
              ]}
              image={heroImg}
              imageAlt="Installation EVplug"
            />

            {/* Process */}
            <section className="relative our-insllation-process-section bg-surface xl:pt-spacing-9xl xl:pb-spacing-7xl py-spacing-7xl top-spacing">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto">
                <div className="grid gap-spacing-6xl">
                  <div className="view-header text-center">
                    <div className="heading-block grid gap-spacing-3xl">
                      <h3 className="tracking-tight m-0">Processus d'installation</h3>
                      <div>
                        <p>Une demarche claire et sans stress, de la demande a la mise en service.</p>
                      </div>
                    </div>
                  </div>

                  <div className="oip_block">
                    <div className="oip_pr md:sticky md:top-[170px]">
                      <StepsList items={steps} />
                    </div>
                    <div className="right flex flex-col">
                      <div className="oip_img flex justify-end relative w-full max-w-[553px] ml-auto">
                        <div>
                          <img
                            src={stepImg1}
                            className="w-[276px] object-cover rounded-2xl"
                            alt="Installation EVplug"
                          />
                          <div className="oip_img_label oip_img_label_left text-lg">
                            <div className="icon">
                              <img src={iconHome} alt="" />
                            </div>
                            <div className="m-0 font-semibold">
                              <p>Techniciens certifies presents dans toutes les grandes villes du Maroc</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="oip_img flex relative w-full max-w-[551px] mr-auto">
                        <div>
                          <img
                            src={stepImg2}
                            className="w-[275px] object-cover rounded-2xl"
                            alt="Installation EVplug"
                          />
                          <div className="oip_img_label oip_img_label_left text-lg">
                            <div className="icon">
                              <img src={iconInstallation} alt="" />
                            </div>
                            <div className="m-0 font-semibold">
                              <p>Pose realisee dans le respect des normes electriques marocaines</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Standard installation accordion */}
            <section className="relative your-charger-section top-spacing">
              <div className="bg-white">
                <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
                  <div className="flex gap-spacing-7xl items-center xl:justify-between justify-center xl:flex-nowrap flex-wrap">
                    <div className="xl:max-w-[480px] xl:w-6/12">
                      <div className="grid gap-spacing-6xl">
                        <div className="view-header">
                          <div className="grid gap-spacing-3xl">
                            <h3 className="tracking-tight m-0 pr-spacing-3xl">
                              Installation standard : ce qui est inclus
                            </h3>
                            <div className="m-0 pr-spacing-3xl">
                              <p>
                                Le forfait standard couvre plus de 90 % des clients, sans supplement de prix, a
                                condition de disposer d'un parking prive et des autorisations necessaires. Il
                                comprend :
                              </p>
                            </div>
                          </div>
                        </div>
                        <Accordion items={standardItems} />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-6 md:max-w-[582px] max-w-[370px] xl:w-6/12 w-full">
                      <div className="first-top xl:ml-auto">
                        <img
                          src={standardImg1}
                          alt=""
                          className="md:w-[379px] md:h-[505px] w-[240px] h-auto object-cover rounded-2xl"
                        />
                      </div>
                      <div className="second-bottom mr-auto relative -mt-[120px]">
                        <img
                          src={standardImg2}
                          alt=""
                          className="md:w-[276px] md:h-[276px] w-[175px] h-[175px] object-cover rounded-2xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Promo banner */}
            <section className="relative bg-graylight md:pt-12 pt-5">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto py-spacing-7xl gap-spacing-6xl grid">
                <div
                  className="relative grid rounded-xl p-spacing-7xl items-center md:grid-flow-col gap-spacing-7xl"
                  style={{ backgroundColor: '#550041' }}
                >
                  <div className="banner-content grid gap-spacing-4xl">
                    <div className="grid gap-spacing-xl">
                      <div>
                        <h2
                          className="m-0 uppercase font-PosterCutNeue font-normal xl:font-7xl font-6xl"
                          style={{ color: '#e89a96' }}
                        >
                          Votre projet de recharge commence ici
                        </h2>
                      </div>
                      <div className="m-0" style={{ color: '#ffffff' }}>
                        <p>
                          L'installation standard EVplug est incluse quelle que soit la formule choisie, achat direct
                          ou Carte EVplug.
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-start gap-spacing-xl">
                      <Link className="btn-secondary" to="/contact-us">
                        Installer une borne EVplug
                      </Link>
                      <Link to="/contact-us" className="text-white btn btn-tertiary">
                        Etudier votre projet
                        <i className="fa-solid fa-angle-right ms-3 text-white relative" />
                      </Link>
                    </div>
                  </div>
                  <div className="grid grid-col-2 md:justify-end justify-center">
                    <div className="w-full max-w-[217px]">
                      <img className="px-0 md:mx-auto !mx-0" src={spanner} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="bg-white">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
                <div className="view-header text-center">
                  <div className="heading-block pb-12 grid gap-spacing-sm">
                    <h4 className="tracking-tight m-0">Questions frequentes</h4>
                  </div>
                </div>
                <Accordion variant="faq" items={faqAccordionItems} defaultOpen={-1} />
              </div>
            </section>
          </div>
        </article>
      </div>
    </MirrorShell>
  )
}
