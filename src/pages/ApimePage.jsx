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
  { value: '2023', label: "Fondation de l'APIME à Casablanca" },
  { value: '14', label: "Membres au conseil d'administration" },
  { value: '2 500+', label: 'Bornes de recharge projetées sur 3 ans' },
  { value: 'VP', label: "Rôle d'EVplug au sein du bureau" },
]

const pillars = [
  {
    icon: icons.profile,
    title: 'Fédérer la filière',
    description:
      "Rassembler énergie, automobile, infrastructure et services autour d'une voix commune et d'une feuille de route partagée.",
  },
  {
    icon: icons.installation,
    title: 'Déployer les bornes',
    description:
      "Accélérer le maillage du territoire marocain en bornes AC et DC, avec des standards de fiabilité élevés.",
  },
  {
    icon: icons.tick,
    title: 'Promouvoir la qualité',
    description:
      "Définir des référentiels techniques, des normes d'installation et la certification des professionnels.",
  },
  {
    icon: icons.dashboard,
    title: "Dialoguer avec l'État",
    description:
      "Porter les besoins du secteur privé auprès des pouvoirs publics et co-construire un cadre réglementaire adapté.",
  },
]

const timeline = [
  {
    date: 'Janvier 2023',
    title: "Naissance de l'APIME",
    body: "Assemblée générale constitutive à Casablanca. Élection du premier bureau et adoption des statuts.",
  },
  {
    date: 'Février 2023',
    title: 'Réception par la CGEM',
    body: "Le bureau de l'APIME est reçu par la Confédération Générale des Entreprises du Maroc pour formaliser sa place dans l'écosystème.",
  },
  {
    date: '2024',
    title: 'Roadmap infrastructure',
    body: "Annonce d'un plan de déploiement de plus de 2 500 bornes de recharge sur trois ans, en coordination avec les acteurs publics et privés.",
  },
  {
    date: '2025',
    title: 'EVplug à la vice-présidence',
    body: "EVplug rejoint le bureau de l'APIME et prend la vice-présidence, mobilisant son expérience opérationnelle au service de la filière.",
  },
]

const contributions = [
  {
    tag: 'Gouvernance',
    title: 'Vice-présidence',
    body:
      "EVplug participe activement au pilotage de l'association, à la coordination des groupes de travail et à la représentation publique de la filière.",
  },
  {
    tag: 'Technique',
    title: 'Standards & référentiels',
    body:
      "Nous contribuons aux spécifications techniques, aux exigences de sécurité et aux retours terrain issus de milliers d'installations.",
  },
  {
    tag: 'Formation',
    title: 'Montée en compétence',
    body:
      "Le programme de certification installateurs et les formations entreprises EVplug nourrissent la professionnalisation du secteur.",
  },
  {
    tag: 'Plaidoyer',
    title: 'Dialogue institutionnel',
    body:
      "Nous défendons auprès des pouvoirs publics les enjeux opérationnels du déploiement : foncier, raccordement, fiscalité et incitations.",
  },
]

const publications = [
  {
    type: 'Communiqué',
    date: 'Janvier 2025',
    title: 'Plan national de déploiement des bornes de recharge',
    excerpt:
      "L'APIME présente sa feuille de route pour porter le maillage des bornes à un niveau compétitif à l'échelle régionale.",
    href: '#',
  },
  {
    type: 'Étude',
    date: 'Novembre 2024',
    title: 'État des lieux de la mobilité électrique au Maroc',
    excerpt:
      "Cartographie des usages, des opérateurs et des freins au passage à l'électrique : un document de référence pour la filière.",
    href: '#',
  },
  {
    type: 'Position',
    date: 'Septembre 2024',
    title: 'Pour un cadre fiscal incitatif des bornes VE',
    excerpt:
      "L'association formule des propositions concrètes pour aligner la fiscalité marocaine sur les meilleurs standards internationaux.",
    href: '#',
  },
  {
    type: 'Événement',
    date: 'Juin 2024',
    title: "Africa EV Mobility Expo : retour sur l'édition",
    excerpt:
      "Synthèse des temps forts, des annonces et des intervenants de l'édition annuelle organisée à Casablanca.",
    href: '#',
  },
  {
    type: 'Communiqué',
    date: 'Mars 2024',
    title: 'Partenariat APIME — CGEM sur la formation',
    excerpt:
      "Lancement d'un programme conjoint pour structurer la formation des installateurs et techniciens de la recharge VE.",
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
    <MirrorShell documentTitle="APIME | Le rôle d'EVplug à la vice-présidence">
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb
              current="APIME"
              trail={[{ to: '/about', label: 'À propos' }]}
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
                      Engagement filière
                    </span>
                    <h1 className="font-PosterCutNeue tracking-tight m-0 text-white text-5xl xl:text-7xl leading-[1.05]">
                      EVplug à la vice-présidence
                      <span style={{ color: LIME }}> de l&rsquo;APIME.</span>
                    </h1>
                    <p className="m-0 max-w-[640px] text-white/85 text-lg">
                      L&rsquo;APIME — Association Professionnelle Intersectorielle pour la Mobilité
                      Électrique — fédère les acteurs privés qui construisent le Maroc électrique
                      de demain. En tant que vice-président, EVplug pilote la transformation aux
                      côtés des opérateurs, des constructeurs et des pouvoirs publics.
                    </p>
                    <div className="flex flex-wrap gap-spacing-xl">
                      <a href="#publications" className="btn btn-primary font-base">
                        Voir les publications
                      </a>
                      <Link to="/about" className="btn btn-primary-outline font-base">
                        Retour À propos
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
                        Les piliers de l&rsquo;APIME
                      </span>
                      <h2 className="tracking-tight m-0 mt-spacing-3xl">
                        Une association bâtie sur quatre engagements.
                      </h2>
                    </div>
                    <p className="xl:col-span-5 m-0 text-gray-600">
                      L&rsquo;APIME concentre l&rsquo;action collective des acteurs privés autour de quatre
                      axes structurants pour le marché marocain.
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
                      Repères
                    </span>
                    <h2 className="tracking-tight m-0">
                      Une jeune association, des étapes déjà marquantes.
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
                      Le rôle d&rsquo;EVplug
                    </span>
                    <h2 className="tracking-tight m-0 text-white">
                      Quatre contributions concrètes à la filière.
                    </h2>
                    <p className="m-0 text-white/80">
                      EVplug met son expérience opérationnelle, ses outils et son réseau au service
                      du collectif APIME. Voici, concrètement, comment nous faisons avancer la
                      mobilité électrique au Maroc.
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
                        Suivez les prises de parole et les travaux de l&rsquo;association.
                      </h2>
                    </div>
                    <p className="xl:col-span-5 m-0 text-gray-600">
                      Communiqués, études, positions, événements : retrouvez les publications de
                      l&rsquo;APIME et les contributions auxquelles EVplug participe.
                    </p>
                  </div>

                  <CardsCarousel
                    ariaLabel="Publications de l'APIME"
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
              title="Construisons ensemble la mobilité électrique du Maroc."
              body="Vous êtes installateur, entreprise, collectivité ou acteur de la filière ? Échangeons sur vos projets et sur la manière dont EVplug et l'APIME peuvent vous accompagner."
              ctas={[
                { to: '/contact-us', label: 'Nous contacter', variant: 'secondary' },
                { to: '/training', label: 'Découvrir nos formations', variant: 'secondary-outline' },
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
