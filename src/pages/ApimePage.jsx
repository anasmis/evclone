import MirrorShell from './MirrorShell'
import Breadcrumb from '../components/sections/Breadcrumb'
import CardsCarousel from '../components/common/CardsCarousel'
import CtaBanner from '../components/sections/CtaBanner'
import { icons } from '../migrated/assets/solutions/shared/icons'
import ctaImageSrc from '../migrated/assets/solutions/shared/cta-image.svg'
import apimeLogo from '../migrated/assets/apime/apime-logo-mark.png'
import hartiImg from '../migrated/assets/apime/board/harti.jpg'
import ansrahImg from '../migrated/assets/apime/board/ansrah.jpg'
import bennaniImg from '../migrated/assets/apime/board/bennani.jpg'
import amraniImg from '../migrated/assets/apime/board/amrani.jpg'
import benjellounImg from '../migrated/assets/apime/board/benjelloun.jpg'
import alazrakImg from '../migrated/assets/apime/board/alazrak.jpg'
import aioucheImg from '../migrated/assets/apime/board/aiouche.jpg'
import taarjiImg from '../migrated/assets/apime/board/taarji.jpg'
import boukaaImg from '../migrated/assets/apime/board/boukaa.jpg'

const FOREST = '#0a1f1a'
const FOREST_SOFT = '#123d33'
const LIME = '#c8d72d'

const stats = [
  { value: '2023', label: "Fondation de l'APIME au Maroc" },
  { value: '6', label: 'Collèges couvrant toute la chaîne de valeur' },
  { value: '2 500', label: 'Bornes de recharge à horizon 2026' },
  { value: '22,5 Mrd', label: 'Dirhams alloués à la mobilité électrique' },
]

const missions = [
  {
    icon: icons.profile,
    title: 'Animer le secteur',
    description:
      "L'APIME anime le secteur de la mobilité électrique au Maroc et participe au modèle de transition énergétique propre au Royaume. De la modération au contact institutionnel, elle est votre interface en mobilité électrique.",
  },
  {
    icon: icons.installation,
    title: "Renforcer l'infrastructure nationale",
    description:
      "Une force unifiée qui œuvre quotidiennement pour renforcer l'infrastructure nationale. Pour asseoir sa position de leader régional, le Maroc se place au rendez-vous de la mobilité du futur.",
  },
  {
    icon: icons.tick,
    title: 'Fédérer le secteur privé',
    description:
      "L'APIME regroupe les principaux acteurs de toute la chaîne de valeur : installation, maîtrise d'ouvrage, bornes de recharge, VE, 2-roues électriques. Tout le spectre mène une action unifiée au sein de l'Association.",
  },
  {
    icon: icons.vehicle,
    title: 'Promouvoir la mobilité du futur',
    description:
      "Appuyer l'implication des instances nationales dans l'encouragement et les incitations en faveur de la mobilité électrique, portée par une Roadmap posant tous les jalons et les axes de travail.",
  },
]

const colleges = [
  {
    num: 'I',
    icon: icons.smartCharge,
    title: 'Recherche & développement',
    description: 'Recherche et développement, certification et promotion de la mobilité électrique.',
  },
  {
    num: 'II',
    icon: icons.installation,
    title: "Fabrication d'équipements",
    description: "Fabrication d'équipements de recharge de véhicules électriques.",
  },
  {
    num: 'III',
    icon: icons.coins,
    title: "Vente d'équipements",
    description: "Commercialisation d'équipements de recharge de véhicules électriques.",
  },
  {
    num: 'IV',
    icon: icons.standaloneCharger,
    title: "Maîtrise d'ouvrage",
    description: "Maîtrise d'ouvrage d'équipements de recharge, jusqu'à la mise en service.",
  },
  {
    num: 'V',
    icon: icons.dashboard,
    title: "Exploitation d'équipements",
    description: "Exploitation d'équipements de recharge de véhicules électriques.",
  },
  {
    num: 'VI',
    icon: icons.vehicle,
    title: 'Véhicules électriques',
    description:
      'Fabrication ou vente de véhicules utilisateurs de recharge, participant à la promotion de la mobilité durable.',
  },
]

const board = [
  { name: 'Omar EL HARTI', role: 'Président', org: 'Directeur Général, Centrelec', img: hartiImg },
  { name: 'Walid ANSRAH', role: 'Vice-Président', org: 'CEO, EV PLUG', img: ansrahImg },
  { name: 'Adil BENNANI', role: 'Secrétaire Général', org: 'Directeur Général, Auto Nejma', img: bennaniImg },
  { name: 'Moulay Hafid AMRANI', role: 'Secrétaire Général Adjoint', org: 'Directeur Général, FastVolt', img: amraniImg },
  { name: 'Allal BENJELLOUN', role: 'Trésorier', org: 'Directeur Général, Meier Energy', img: benjellounImg },
  { name: 'Omar ALAZRAK', role: 'Trésorier Adjoint', org: 'Directeur Général Adjoint, emvc', img: alazrakImg },
  { name: 'Othman AIOUCHE', role: 'Assesseur', org: 'Directeur Général, GM AFRICA', img: aioucheImg },
  { name: 'Othman TAARJI', role: 'Administrateur', org: 'Managing Director, Energy Transfo', img: taarjiImg },
  { name: 'Karim BOUKAA', role: 'Administrateur', org: 'Directeur Général, VSONIC', img: boukaaImg },
]

const members = ['EDEEP', 'VSONIC', 'EVTRICITY', 'CONSULT']

const publications = [
  {
    type: 'Communiqué',
    date: 'Juillet 2023',
    title: '22,5 milliards de dirhams pour la mobilité électrique',
    excerpt:
      "Le 20 juillet 2023, la Commission Nationale de l'Investissement octroie un budget de 22,5 Mrd DH à la mobilité électrique.",
    href: '#',
  },
  {
    type: 'Newsletter',
    date: 'Octobre 2023',
    title: 'Newsletter Mobilité Électrique — Octobre 2023',
    excerpt:
      "Avancées de la Roadmap, actualités de la filière et temps forts du mois pour les membres de l'APIME.",
    href: '#',
  },
  {
    type: 'Newsletter',
    date: 'Septembre 2023',
    title: 'Newsletter de la Mobilité Électrique — Septembre 2023',
    excerpt:
      "Décryptage des chantiers de l'Association et point d'étape sur le déploiement des bornes de recharge.",
    href: '#',
  },
  {
    type: 'Newsletter',
    date: 'Août 2023',
    title: 'Newsletter Mobilité Électrique — Août 2023',
    excerpt:
      "Les dossiers du mois : infrastructure, véhicules électriques et dialogue avec les parties prenantes.",
    href: '#',
  },
  {
    type: 'Newsletter',
    date: 'Juillet 2023',
    title: 'Newsletter Mobilité Électrique APIME — Juillet 2023',
    excerpt:
      "Première édition de la newsletter de l'APIME : objectifs, collèges et feuille de route de la filière.",
    href: '#',
  },
  {
    type: 'Feuille de route',
    date: '2023',
    title: 'Roadmap de la mobilité électrique au Maroc',
    excerpt:
      "2 500 bornes de recharge à horizon 2026, selon un maillage étudié à l'échelle du Royaume.",
    href: '#',
  },
]

function StatChip({ value, label }) {
  return (
    <div className="grid gap-spacing-md">
      <span className="font-PosterCutNeue text-4xl xl:text-5xl leading-[1.1]" style={{ color: LIME }}>
        {value}
      </span>
      <span className="text-[11px] uppercase tracking-[0.18em] text-white/70 leading-snug">{label}</span>
    </div>
  )
}

function BoardCard({ member }) {
  return (
    <div className="group bg-white rounded-3xl border border-gray-200 overflow-hidden grid content-start transition hover:border-gray-400 hover:-translate-y-1">
      <div className="aspect-[4/5] overflow-hidden" style={{ backgroundColor: '#f5f1eb' }}>
        <img
          src={member.img}
          alt={member.name}
          loading="lazy"
          className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="p-spacing-4xl grid gap-spacing-sm">
        <span
          className="text-[11px] uppercase tracking-[0.18em] font-semibold"
          style={{ color: FOREST_SOFT }}
        >
          {member.role}
        </span>
        <h3 className="m-0 tracking-tight text-xl">{member.name}</h3>
        <p className="m-0 text-sm text-gray-600">{member.org}</p>
      </div>
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
    <MirrorShell documentTitle="APIME | Association Professionnelle Intersectorielle pour la Mobilité Électrique">
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb
              current="APIME"
              trail={[{ to: '/about', label: 'À propos' }]}
            />

            {/* Hero — APIME identity on a dark canvas */}
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
                      Association • Maroc • depuis 2023
                    </span>
                    <h1 className="font-PosterCutNeue tracking-tight m-0 text-white text-5xl xl:text-7xl leading-[1.05]">
                      La mobilité électrique au Maroc,
                      <span style={{ color: LIME }}> c&rsquo;est maintenant.</span>
                    </h1>
                    <p className="m-0 max-w-[640px] text-white/85 text-lg">
                      L&rsquo;APIME — Association Professionnelle Intersectorielle pour la Mobilité
                      Électrique — fédère les principaux acteurs de toute la chaîne de valeur et anime
                      le développement de la transition énergétique propre au Royaume. Elle est votre
                      interface en mobilité électrique au Maroc.
                    </p>
                    <div className="flex flex-wrap gap-spacing-xl">
                      <a href="#colleges" className="btn btn-primary font-base">
                        Découvrir nos collèges
                      </a>
                      <a href="#conseil" className="btn btn-primary font-base">
                        Le conseil d&rsquo;administration
                      </a>
                    </div>
                  </div>

                  <div className="xl:col-span-5">
                    <div
                      className="rounded-4xl p-spacing-7xl backdrop-blur-sm grid gap-spacing-6xl"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(200,215,45,0.25)',
                      }}
                    >
                      <div className="flex justify-center">
                        <img
                          src={apimeLogo}
                          alt="APIME — Association Professionnelle Intersectorielle pour la Mobilité Électrique"
                          className="h-24 w-auto object-contain rounded-2xl"
                        />
                      </div>
                      <div
                        aria-hidden="true"
                        className="h-px w-full"
                        style={{ backgroundColor: 'rgba(200,215,45,0.2)' }}
                      />
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

            {/* Missions */}
            <section className="relative bg-white">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
                <div className="grid gap-spacing-6xl">
                  <div className="grid xl:grid-cols-12 gap-spacing-4xl items-end">
                    <div className="xl:col-span-7">
                      <span className="inline-flex items-center px-spacing-md py-spacing-sm rounded-full bg-lime text-black text-xs font-semibold uppercase tracking-[0.2em] w-fit">
                        Notre raison d&rsquo;être
                      </span>
                      <h2 className="tracking-tight m-0 mt-spacing-3xl">
                        Animer, fédérer et accélérer la mobilité électrique.
                      </h2>
                    </div>
                    <p className="xl:col-span-5 m-0 text-gray-600">
                      Le secteur de la mobilité électrique se développe à vitesse grand V. L&rsquo;APIME
                      concentre l&rsquo;action collective des acteurs privés autour de quatre missions
                      structurantes pour le marché marocain.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-spacing-4xl">
                    {missions.map((m, idx) => (
                      <div
                        key={m.title}
                        className="rounded-3xl p-spacing-6xl border border-gray-200 bg-surface grid gap-spacing-3xl content-start"
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center p-3"
                            style={{ backgroundColor: LIME }}
                          >
                            <img src={m.icon} alt="" className="object-contain w-7 h-7" />
                          </div>
                          <span
                            className="font-PosterCutNeue text-4xl leading-none"
                            style={{ color: FOREST_SOFT }}
                          >
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <h3 className="m-0 tracking-tight text-2xl">{m.title}</h3>
                        <p className="m-0 text-gray-600">{m.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Mot du Président */}
            <section className="relative" style={{ backgroundColor: '#f5f1eb' }}>
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
                <div className="grid xl:grid-cols-12 gap-spacing-7xl items-center">
                  <div className="xl:col-span-4">
                    <div className="rounded-3xl overflow-hidden border border-black/5 shadow-sm max-w-[360px] mx-auto xl:mx-0">
                      <img
                        src={hartiImg}
                        alt="Omar EL HARTI, Président de l'APIME"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>

                  <div className="xl:col-span-8 grid gap-spacing-3xl">
                    <span
                      className="inline-flex items-center px-spacing-md py-spacing-sm rounded-full text-xs font-semibold uppercase tracking-[0.2em] w-fit"
                      style={{ backgroundColor: FOREST, color: LIME }}
                    >
                      Mot du Président
                    </span>
                    <blockquote className="m-0 grid gap-spacing-xl">
                      <p className="m-0 font-PosterCutNeue tracking-tight text-3xl xl:text-4xl leading-[1.15]" style={{ color: FOREST }}>
                        «&nbsp;L&rsquo;année 2023 a été celle de tous les défis ; nous avons la certitude
                        que les années à venir seront celles de tous les succès.&nbsp;»
                      </p>
                      <p className="m-0 text-gray-700">
                        En ligne avec les orientations stratégiques du Royaume en faveur de
                        l&rsquo;efficacité énergétique et du développement durable, l&rsquo;APIME s&rsquo;est
                        fixé un objectif ambitieux : déployer 2 500 bornes de recharge à horizon 2026,
                        selon un maillage étudié, pour assurer la mobilité urbaine et extra-urbaine des
                        utilisateurs de véhicules électriques en toute tranquillité.
                      </p>
                      <p className="m-0 text-gray-700">
                        L&rsquo;Association œuvre en faveur de la décarbonation du secteur des transports,
                        qui représente 38&nbsp;% des consommations énergétiques et 20&nbsp;% des émissions
                        de gaz à effet de serre du pays. Elle se structure en 6 collèges couvrant toute la
                        chaîne de valeur, de la R&amp;D à l&rsquo;exploitation.
                      </p>
                    </blockquote>
                    <div className="flex items-center gap-spacing-md pt-spacing-md">
                      <span className="w-10 h-px" style={{ backgroundColor: FOREST }} />
                      <span className="text-sm font-semibold" style={{ color: FOREST }}>
                        Omar EL HARTI — Président de l&rsquo;APIME, Directeur Général de Centrelec
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Les 6 collèges */}
            <section id="colleges" className="relative" style={{ backgroundColor: FOREST }}>
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
                <div className="grid gap-spacing-6xl">
                  <div className="grid xl:grid-cols-12 gap-spacing-4xl items-end">
                    <div className="xl:col-span-7 grid gap-spacing-3xl">
                      <span
                        className="inline-flex items-center px-spacing-md py-spacing-sm rounded-full text-xs font-semibold uppercase tracking-[0.2em] w-fit"
                        style={{ backgroundColor: LIME, color: FOREST }}
                      >
                        Les collèges de l&rsquo;APIME
                      </span>
                      <h2 className="tracking-tight m-0 text-white">
                        Six collèges couvrant toute la chaîne de valeur.
                      </h2>
                    </div>
                    <p className="xl:col-span-5 m-0 text-white/80">
                      De la recherche et développement à l&rsquo;exploitation, en passant par la vente de
                      véhicules et la certification, chaque maillon de la mobilité électrique mène une
                      action unifiée au sein de l&rsquo;Association.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-spacing-4xl">
                    {colleges.map((c) => (
                      <div
                        key={c.num}
                        className="rounded-3xl p-spacing-6xl grid gap-spacing-3xl content-start"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(200,215,45,0.2)',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center p-3"
                            style={{ backgroundColor: LIME }}
                          >
                            <img src={c.icon} alt="" className="object-contain w-7 h-7" />
                          </div>
                          <span className="font-PosterCutNeue text-4xl leading-none" style={{ color: LIME }}>
                            {c.num}
                          </span>
                        </div>
                        <h3 className="m-0 tracking-tight text-2xl text-white">
                          Collège {c.num} — {c.title}
                        </h3>
                        <p className="m-0 text-white/75">{c.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Conseil d'administration */}
            <section id="conseil" className="relative bg-white">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
                <div className="grid gap-spacing-6xl">
                  <div className="grid xl:grid-cols-12 gap-spacing-4xl items-end">
                    <div className="xl:col-span-7 grid gap-spacing-3xl">
                      <span className="inline-flex items-center px-spacing-md py-spacing-sm rounded-full bg-lime text-black text-xs font-semibold uppercase tracking-[0.2em] w-fit">
                        Gouvernance
                      </span>
                      <h2 className="tracking-tight m-0">Le Conseil d&rsquo;Administration de l&rsquo;APIME.</h2>
                    </div>
                    <p className="xl:col-span-5 m-0 text-gray-600">
                      Des dirigeants issus de toute la filière — énergie, automobile, infrastructure et
                      services — portent ensemble la voix de la mobilité électrique marocaine.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-spacing-4xl">
                    {board.map((member) => (
                      <BoardCard key={member.name} member={member} />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Publications carousel */}
            <section className="relative" id="publications" style={{ backgroundColor: '#f5f1eb' }}>
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
                <div className="grid gap-spacing-6xl">
                  <div className="grid xl:grid-cols-12 gap-spacing-4xl items-end">
                    <div className="xl:col-span-7 grid gap-spacing-3xl">
                      <span className="inline-flex items-center px-spacing-md py-spacing-sm rounded-full bg-lime text-black text-xs font-semibold uppercase tracking-[0.2em] w-fit">
                        Publications APIME
                      </span>
                      <h2 className="tracking-tight m-0">
                        La newsletter de la mobilité électrique au Maroc.
                      </h2>
                    </div>
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
              title="Rejoignez la filière de la mobilité électrique."
              body="Installateur, constructeur, opérateur ou acteur de l'énergie ? Adhérez à l'APIME et participez à l'action collective qui construit le Maroc électrique de demain."
              ctas={[
                { to: '/contact-us', label: 'Nous contacter', variant: 'secondary' },
                { to: '/about', label: 'À propos', variant: 'secondary-outline' },
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
