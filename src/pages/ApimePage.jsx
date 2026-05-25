import { Link } from 'react-router-dom'
import MirrorShell from './MirrorShell'
import Breadcrumb from '../components/sections/Breadcrumb'
import CardsCarousel from '../components/common/CardsCarousel'
import CtaBanner from '../components/sections/CtaBanner'
import { icons } from '../migrated/assets/solutions/shared/icons'
import ctaImageSrc from '../migrated/assets/solutions/shared/cta-image.svg'

const FOREST = '#0a1f1a'
const FOREST_SOFT = '#123d33'
const LIME = '#c8d72d'

const stats = [
  { value: '2023', label: 'Fondation de l’APIME a Casablanca' },
  { value: '14', label: 'Membres au conseil d’administration' },
  { value: '2 500+', label: 'Bornes de recharge projetees sur 3 ans' },
  { value: 'VP', label: 'Role d’EVplug au sein du bureau' },
]

const pillars = [
  {
    icon: icons.profile,
    title: 'Federer la filiere',
    description:
      "Rassembler energie, automobile, infrastructure et services autour d'une voix commune et d'une feuille de route partagee.",
  },
  {
    icon: icons.installation,
    title: 'Deployer les bornes',
    description:
      "Accelerer le maillage du territoire marocain en bornes AC et DC, avec des standards de fiabilite eleves.",
  },
  {
    icon: icons.tick,
    title: 'Promouvoir la qualite',
    description:
      'Definir des referentiels techniques, des normes d’installation et la certification des professionnels.',
  },
  {
    icon: icons.dashboard,
    title: 'Dialoguer avec l’Etat',
    description:
      "Porter les besoins du secteur prive aupres des pouvoirs publics et co-construire un cadre reglementaire adapte.",
  },
]

const timeline = [
  {
    date: 'Janvier 2023',
    title: 'Naissance de l’APIME',
    body: 'Assemblee generale constitutive a Casablanca. Election du premier bureau et adoption des statuts.',
  },
  {
    date: 'Fevrier 2023',
    title: 'Reception par la CGEM',
    body: 'Le bureau de l’APIME est recu par la Confederation Generale des Entreprises du Maroc pour formaliser sa place dans l’ecosysteme.',
  },
  {
    date: '2024',
    title: 'Roadmap infrastructure',
    body: 'Annonce d’un plan de deploiement de plus de 2 500 bornes de recharge sur trois ans, en coordination avec les acteurs publics et prives.',
  },
  {
    date: '2025',
    title: 'EVplug a la vice-presidence',
    body: 'EVplug rejoint le bureau de l’APIME et prend la vice-presidence, mobilisant son experience operationnelle au service de la filiere.',
  },
]

const contributions = [
  {
    tag: 'Gouvernance',
    title: 'Vice-presidence',
    body:
      "EVplug participe activement au pilotage de l'association, a la coordination des groupes de travail et a la representation publique de la filiere.",
  },
  {
    tag: 'Technique',
    title: 'Standards & referentiels',
    body:
      "Nous contribuons aux specifications techniques, aux exigences de securite et aux retours terrain issus de milliers d'installations.",
  },
  {
    tag: 'Formation',
    title: 'Montee en competence',
    body:
      "Le programme de certification installateurs et les formations entreprises EVplug nourrissent la professionnalisation du secteur.",
  },
  {
    tag: 'Plaidoyer',
    title: 'Dialogue institutionnel',
    body:
      "Nous defendons aupres des pouvoirs publics les enjeux operationnels du deploiement : foncier, raccordement, fiscalite et incitations.",
  },
]

const publications = [
  {
    type: 'Communique',
    date: 'Janvier 2025',
    title: 'Plan national de deploiement des bornes de recharge',
    excerpt:
      "L'APIME presente sa feuille de route pour porter le maillage des bornes a un niveau competitif a l'echelle regionale.",
    href: '#',
  },
  {
    type: 'Etude',
    date: 'Novembre 2024',
    title: 'Etat des lieux de la mobilite electrique au Maroc',
    excerpt:
      'Cartographie des usages, des operateurs et des freins au passage a l’electrique : un document de reference pour la filiere.',
    href: '#',
  },
  {
    type: 'Position',
    date: 'Septembre 2024',
    title: 'Pour un cadre fiscal incitatif des bornes VE',
    excerpt:
      "L'association formule des propositions concretes pour aligner la fiscalite marocaine sur les meilleurs standards internationaux.",
    href: '#',
  },
  {
    type: 'Evenement',
    date: 'Juin 2024',
    title: 'Africa EV Mobility Expo : retour sur l’edition',
    excerpt:
      'Synthese des temps forts, des annonces et des intervenants de l’edition annuelle organisee a Casablanca.',
    href: '#',
  },
  {
    type: 'Communique',
    date: 'Mars 2024',
    title: 'Partenariat APIME — CGEM sur la formation',
    excerpt:
      'Lancement d’un programme conjoint pour structurer la formation des installateurs et techniciens de la recharge VE.',
    href: '#',
  },
]

function StatChip({ value, label }) {
  return (
    <div className="grid gap-spacing-md">
      <span className="font-PosterCutNeue text-5xl leading-[1.1]" style={{ color: LIME }}>
        {value}
      </span>
      <span className="text-[11px] uppercase tracking-[0.18em] text-white/70 leading-snug">{label}</span>
    </div>
  )
}

function PublicationCard({ pub }) {
  return (
    <a
      href={pub.href}
      className="group block h-full bg-white rounded-3xl border border-gray-200 p-spacing-6xl grid gap-spacing-3xl content-start transition hover:border-gray-400 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center px-spacing-md py-spacing-xs rounded-full text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ backgroundColor: LIME, color: FOREST }}
        >
          {pub.type}
        </span>
        <span className="text-xs uppercase tracking-[0.15em] text-gray-500">{pub.date}</span>
      </div>
      <h3 className="m-0 tracking-tight text-2xl group-hover:underline">{pub.title}</h3>
      <p className="m-0 text-gray-600">{pub.excerpt}</p>
      <span className="inline-flex items-center gap-spacing-sm text-sm font-semibold" style={{ color: FOREST_SOFT }}>
        Lire la publication
        <i className="fa-solid fa-angle-right" />
      </span>
    </a>
  )
}

export default function ApimePage() {
  return (
    <MirrorShell documentTitle="APIME | Le role d'EVplug a la vice-presidence">
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb
              current="APIME"
              trail={[{ to: '/about', label: 'A propos' }]}
            />

            {/* Hero — bold, asymmetric, dark canvas */}
            <section
              className="relative overflow-hidden"
              style={{ backgroundColor: FOREST }}
            >
              <div
                aria-hidden="true"
                className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full opacity-20 blur-3xl"
                style={{ backgroundColor: LIME }}
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-40 -left-20 w-[420px] h-[420px] rounded-full opacity-10 blur-3xl"
                style={{ backgroundColor: LIME }}
              />
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto relative z-10 xl:py-spacing-9xl py-spacing-7xl">
                <div className="grid xl:grid-cols-12 gap-spacing-7xl items-center">
                  <div className="xl:col-span-7 grid gap-spacing-4xl">
                    <span
                      className="inline-flex items-center gap-spacing-sm px-spacing-md py-spacing-sm rounded-full w-fit text-xs font-semibold uppercase tracking-[0.2em]"
                      style={{ backgroundColor: LIME, color: FOREST }}
                    >
                      Engagement filiere
                    </span>
                    <h1 className="font-PosterCutNeue tracking-tight m-0 text-white text-5xl xl:text-7xl leading-[1.05]">
                      EVplug a la vice-presidence
                      <span style={{ color: LIME }}> de l’APIME.</span>
                    </h1>
                    <p className="m-0 max-w-[640px] text-white/85 text-lg">
                      L’APIME — Association Professionnelle Intersectorielle pour la Mobilite
                      Electrique — federe les acteurs prives qui construisent le Maroc electrique
                      de demain. En tant que vice-president, EVplug pilote la transformation aux
                      cotes des operateurs, des constructeurs et des pouvoirs publics.
                    </p>
                    <div className="flex flex-wrap gap-spacing-xl">
                      <a href="#publications" className="btn btn-primary font-base">
                        Voir les publications
                      </a>
                      <Link to="/about" className="btn btn-primary-outline font-base">
                        Retour A propos
                      </Link>
                    </div>
                  </div>

                  <div className="xl:col-span-5">
                    <div
                      className="rounded-3xl p-spacing-7xl backdrop-blur-sm"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(200,215,45,0.25)',
                      }}
                    >
                      <div className="grid grid-cols-2 gap-spacing-6xl">
                        {stats.map((s) => (
                          <StatChip key={s.label} value={s.value} label={s.label} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Pillars */}
            <section className="relative bg-white">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
                <div className="grid gap-spacing-6xl">
                  <div className="grid xl:grid-cols-12 gap-spacing-4xl items-end">
                    <div className="xl:col-span-7">
                      <span className="inline-flex items-center px-spacing-md py-spacing-sm rounded-full bg-lime text-black text-xs font-semibold uppercase tracking-[0.2em] w-fit">
                        Les piliers de l’APIME
                      </span>
                      <h2 className="tracking-tight m-0 mt-spacing-3xl">
                        Une association batie sur quatre engagements.
                      </h2>
                    </div>
                    <p className="xl:col-span-5 m-0 text-gray-600">
                      L’APIME concentre l’action collective des acteurs prives autour de quatre
                      axes structurants pour le marche marocain.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-spacing-4xl">
                    {pillars.map((p, idx) => (
                      <div
                        key={p.title}
                        className="rounded-3xl p-spacing-6xl border border-gray-200 bg-surface grid gap-spacing-3xl content-start"
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center p-3"
                            style={{ backgroundColor: LIME }}
                          >
                            <img src={p.icon} alt="" className="object-contain w-7 h-7" />
                          </div>
                          <span
                            className="font-PosterCutNeue text-4xl leading-none"
                            style={{ color: FOREST_SOFT }}
                          >
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <h3 className="m-0 tracking-tight text-2xl">{p.title}</h3>
                        <p className="m-0 text-gray-600">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Timeline */}
            <section className="relative" style={{ backgroundColor: '#f5f1eb' }}>
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
                <div className="grid gap-spacing-6xl">
                  <div className="text-center grid gap-spacing-3xl max-w-[720px] mx-auto">
                    <span
                      className="inline-flex items-center px-spacing-md py-spacing-sm rounded-full text-xs font-semibold uppercase tracking-[0.2em] w-fit mx-auto"
                      style={{ backgroundColor: FOREST, color: LIME }}
                    >
                      Reperes
                    </span>
                    <h2 className="tracking-tight m-0">
                      Une jeune association, des etapes deja marquantes.
                    </h2>
                  </div>

                  <div className="relative">
                    <div
                      aria-hidden="true"
                      className="hidden md:block absolute left-0 right-0 top-7 h-px"
                      style={{ backgroundColor: 'rgba(10,31,26,0.15)' }}
                    />
                    <div className="grid md:grid-cols-4 gap-spacing-6xl">
                      {timeline.map((m) => (
                        <div key={m.title} className="grid gap-spacing-3xl">
                          <div className="flex items-center gap-spacing-md">
                            <span
                              className="w-3.5 h-3.5 rounded-full shrink-0"
                              style={{ backgroundColor: FOREST, outline: `4px solid ${LIME}` }}
                            />
                            <span
                              className="text-xs uppercase tracking-[0.18em] font-semibold"
                              style={{ color: FOREST }}
                            >
                              {m.date}
                            </span>
                          </div>
                          <h3 className="m-0 tracking-tight text-xl">{m.title}</h3>
                          <p className="m-0 text-gray-700 text-sm">{m.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* EVplug spotlight */}
            <section className="relative" style={{ backgroundColor: FOREST }}>
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
                <div className="grid xl:grid-cols-12 gap-spacing-7xl items-start">
                  <div className="xl:col-span-5 grid gap-spacing-3xl">
                    <span
                      className="inline-flex items-center px-spacing-md py-spacing-sm rounded-full text-xs font-semibold uppercase tracking-[0.2em] w-fit"
                      style={{ backgroundColor: LIME, color: FOREST }}
                    >
                      Le role d’EVplug
                    </span>
                    <h2 className="tracking-tight m-0 text-white">
                      Quatre contributions concretes a la filiere.
                    </h2>
                    <p className="m-0 text-white/80">
                      EVplug met son experience operationnelle, ses outils et son reseau au service
                      du collectif APIME. Voici, concretement, comment nous faisons avancer la
                      mobilite electrique au Maroc.
                    </p>
                  </div>

                  <div className="xl:col-span-7 grid md:grid-cols-2 gap-spacing-4xl">
                    {contributions.map((c) => (
                      <div
                        key={c.title}
                        className="rounded-3xl p-spacing-6xl grid gap-spacing-3xl content-start"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(200,215,45,0.2)',
                        }}
                      >
                        <span
                          className="text-xs uppercase tracking-[0.18em] font-semibold"
                          style={{ color: LIME }}
                        >
                          {c.tag}
                        </span>
                        <h3 className="m-0 tracking-tight text-2xl text-white">{c.title}</h3>
                        <p className="m-0 text-white/75">{c.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Publications carousel */}
            <section className="relative bg-white" id="publications">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
                <div className="grid gap-spacing-6xl">
                  <div className="grid xl:grid-cols-12 gap-spacing-4xl items-end">
                    <div className="xl:col-span-7 grid gap-spacing-3xl">
                      <span className="inline-flex items-center px-spacing-md py-spacing-sm rounded-full bg-lime text-black text-xs font-semibold uppercase tracking-[0.2em] w-fit">
                        Publications APIME
                      </span>
                      <h2 className="tracking-tight m-0">
                        Suivez les prises de parole et les travaux de l’association.
                      </h2>
                    </div>
                    <p className="xl:col-span-5 m-0 text-gray-600">
                      Communiques, etudes, positions, evenements : retrouvez les publications de
                      l’APIME et les contributions auxquelles EVplug participe.
                    </p>
                  </div>

                  <CardsCarousel
                    ariaLabel="Publications de l’APIME"
                    slideClassName="basis-full md:basis-1/2 xl:basis-1/3"
                    autoPlay
                    interval={6000}
                  >
                    {publications.map((pub) => (
                      <PublicationCard key={pub.title} pub={pub} />
                    ))}
                  </CardsCarousel>
                </div>
              </div>
            </section>

            <CtaBanner
              title="Construisons ensemble la mobilite electrique du Maroc."
              body="Vous etes installateur, entreprise, collectivite ou acteur de la filiere ? Echangeons sur vos projets et sur la maniere dont EVplug et l'APIME peuvent vous accompagner."
              ctas={[
                { to: '/contact-us', label: 'Nous contacter', variant: 'secondary' },
                { to: '/training', label: 'Decouvrir nos formations', variant: 'secondary-outline' },
              ]}
              decorImage={ctaImageSrc}
              decorBg={LIME}
            />
          </div>
        </article>
      </div>
    </MirrorShell>
  )
}
