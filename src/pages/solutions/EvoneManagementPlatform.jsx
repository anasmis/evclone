import { useEffect, useState } from 'react'
import SolutionPageLayout from './SolutionPageLayout'
import Hero from '../../components/sections/Hero'
import CtaBanner from '../../components/sections/CtaBanner'
import Accordion from '../../components/sections/Accordion'
import { icons } from '../../migrated/assets/solutions/shared/icons'
import evoneLaptopImg from '../../migrated/assets/solutions/shared/evone-laptop.jpeg'
import evoneInstallImg from '../../migrated/assets/solutions/shared/evone-install.jpeg'
import ctaImage from '../../migrated/assets/solutions/shared/cta-image.svg'
import { fetchEvonePage, strapiMediaUrl, submitPlatformDemoRequest } from '../../lib/api/strapi'

// ---------------------------------------------------------------------------
// Fallback content — used when Strapi is unreachable or the page hasn't been
// published yet. Mirrors the schema of /api/evone-platform-page.
// ---------------------------------------------------------------------------
const FALLBACK = {
  documentTitle: 'Plateforme Evone | EVplug',
  heroTag: 'Plateforme Evone',
  heroTitle: 'Plateforme Evone',
  heroSubtitle:
    'Pilotez, monétisez et optimisez vos sites de recharge avec Evone, la plateforme EVplug conçue pour les opérateurs au Maroc.',
  heroCtaLabel: 'Demander une démo',
  heroCtaHref: '/contact-us',
  heroImage: evoneLaptopImg,
  featurePills: [
    {
      icon: icons.dashboard,
      title: 'Sites & Bornes',
      description: 'Visualisez chaque site, borne et connecteur dans une seule console.',
    },
    {
      icon: icons.coins,
      title: 'Utilisateurs & Tarification',
      description: "Configurez des règles tarifaires et des droits d'accès par groupe.",
    },
    {
      icon: icons.tick,
      title: 'Analyses & Reporting',
      description: "Suivez l'utilisation, les revenus et l'énergie délivrée en temps réel.",
    },
  ],
  detailRows: [
    {
      image: evoneLaptopImg,
      title: 'Sites et bornes',
      lead: 'Obtenez une vue globale de votre réseau de recharge.',
      intro: "Evone unifie la mise en service, la connectivité et l'exploitation pour vous permettre de :",
      bullets: [
        "Centraliser l'état des sites, bornes et connecteurs.",
        'Suivre les sessions, la disponibilité et les alertes sur tout le parc.',
        'Appliquer des règles par site, région ou segment client.',
      ],
    },
    {
      image: evoneInstallImg,
      title: 'Utilisateurs et tarification',
      lead: 'Concevez une tarification adaptée à votre activité au Maroc.',
      intro: 'Evone vous aide à configurer le modèle commercial dont vous avez besoin :',
      bullets: [
        'Tarification au kWh, au temps ou hybride par tranche horaire.',
        'Grilles tarifaires pour flottes, résidences, collaborateurs ou grand public.',
        'Gestion des accès via rôles, groupes RFID et partenaires.',
      ],
      reversed: true,
    },
    {
      image: evoneLaptopImg,
      title: 'Analyses et reporting',
      lead: 'Transformez les données de recharge en décisions opérationnelles.',
      intro: 'Evone fournit des rapports exploitables pour :',
      bullets: [
        "Suivre l'utilisation, les revenus et la disponibilité par site.",
        'Comparer les performances et identifier les opportunités de croissance.',
        "Reporter l'impact CO2 et l'énergie délivrée pour vos bilans ESG.",
      ],
    },
  ],
  midCtaTitle: 'Pilotez, gérez & optimisez.',
  midCtaBody: 'Evone vous donne une vision complète de votre réseau de recharge au Maroc.',
  midCtaLabel: 'Demander une démo',
  midCtaHref: '/contact-us',
  midCtaDecorImage: ctaImage,
  midCtaDecorBg: '#87b4e1',
  operationsRows: [
    {
      image: evoneInstallImg,
      title: 'Exploitation multi-sites',
      lead: "Passez d'un site à un réseau national.",
      intro: 'Evone vous aide à exploiter plusieurs sites au Maroc avec sérénité :',
      bullets: [
        'Appliquer des règles et un branding cohérents entre sites.',
        'Donner des accès locaux tout en gardant le contrôle central.',
        'Réconcilier revenus et usage par site, région ou client.',
      ],
    },
    {
      image: evoneLaptopImg,
      title: 'Programmes flottes et entreprises',
      lead: 'Donnez aux flottes la visibilité dont elles ont besoin.',
      bullets: [
        'Séparez les sessions collaborateurs et flotte via des groupes intelligents.',
        'Centralisez les données domicile, entreprise et public dans un seul rapport.',
        "Partagez l'impact CO2 et les coûts pour les équipes durabilité.",
      ],
      reversed: true,
    },
  ],
  faqItems: [
    {
      question: 'Mon équipe doit-elle être formée pour Evone ?',
      answer:
        '<p>Evone est intuitive et facile à prendre en main. Nous proposons aussi des parcours guidés et un accompagnement au démarrage.</p>',
    },
    {
      question: 'Quelle est la flexibilité des tarifs sur Evone ?',
      answer:
        "<p>Votre modèle tarifaire peut être simple ou dynamique. Configurez des tarifs au kWh, au temps ou hybrides, par tranche horaire et par groupe d'utilisateurs.</p><p>Les promotions, frais minimums et pénalités d'occupation sont également disponibles.</p>",
    },
    {
      question: 'Comment EVplug sécurise-t-elle vos données ?',
      answer:
        '<p>EVplug prend la sécurité des données au sérieux.</p><ul><li>Les données transitent via https avec TLS 1.2.</li><li>Nos systèmes sont hébergés sur une infrastructure cloud sécurisée.</li><li>Nous effectuons des audits réguliers de sécurité.</li></ul>',
    },
    {
      question: 'Comment configurer Evone ?',
      answer:
        "<p>Une fois vos bornes installées et connectées, l'équipe EVplug configure votre espace Evone et partage des accès sécurisés pour vos administrateurs.</p>",
    },
    {
      question: "Ai-je besoin d'équipements ou de logiciels supplémentaires ?",
      answer:
        "<p>Non. Evone est une plateforme web accessible depuis un navigateur moderne sur ordinateur, tablette ou mobile. Vos bornes doivent simplement disposer d'une connexion data stable.</p>",
    },
  ],
  ctaInterest: 'Plateforme Evone',
  ctaButtonLabel: 'Demander une démo',
  ctaTitle: 'Demander une démo Evone',
  ctaSubtitle:
    'Décrivez votre réseau et vos objectifs : un expert EVplug vous propose une démonstration personnalisée.',
  ctaAccentColor: '#87b4e1',
}

// ---------------------------------------------------------------------------
// Normalize a Strapi response (or null) into the same shape as FALLBACK.
// Strapi components hand us URLs for media; we resolve them with strapiMediaUrl
// and fall back to the bundled assets when the field is empty.
// ---------------------------------------------------------------------------
function normalize(api) {
  if (!api) return FALLBACK

  const pickImage = (media, fallback) => strapiMediaUrl(media) || fallback

  const mapRow = (rows, fallbackList) =>
    (rows && rows.length ? rows : fallbackList).map((row, i) => ({
      title: row.title ?? fallbackList[i]?.title,
      lead: row.lead ?? fallbackList[i]?.lead,
      intro: row.intro ?? fallbackList[i]?.intro,
      bullets: Array.isArray(row.bullets) && row.bullets.length
        ? row.bullets
        : fallbackList[i]?.bullets ?? [],
      image: pickImage(row.image, fallbackList[i]?.image),
      reversed: row.reversed ?? fallbackList[i]?.reversed ?? false,
    }))

  return {
    documentTitle: api.documentTitle || FALLBACK.documentTitle,
    heroTag: api.heroTag ?? FALLBACK.heroTag,
    heroTitle: api.heroTitle || FALLBACK.heroTitle,
    heroSubtitle: api.heroSubtitle ?? FALLBACK.heroSubtitle,
    heroCtaLabel: api.heroCtaLabel || FALLBACK.heroCtaLabel,
    heroCtaHref: api.heroCtaHref || FALLBACK.heroCtaHref,
    heroImage: pickImage(api.heroImage, FALLBACK.heroImage),
    featurePills:
      api.featurePills && api.featurePills.length
        ? api.featurePills.map((pill, i) => ({
            title: pill.title ?? FALLBACK.featurePills[i]?.title,
            description: pill.description ?? FALLBACK.featurePills[i]?.description,
            icon: pickImage(pill.icon, FALLBACK.featurePills[i]?.icon),
          }))
        : FALLBACK.featurePills,
    detailRows: mapRow(api.detailRows, FALLBACK.detailRows),
    midCtaTitle: api.midCtaTitle || FALLBACK.midCtaTitle,
    midCtaBody: api.midCtaBody ?? FALLBACK.midCtaBody,
    midCtaLabel: api.midCtaLabel || FALLBACK.midCtaLabel,
    midCtaHref: api.midCtaHref || FALLBACK.midCtaHref,
    midCtaDecorImage: pickImage(api.midCtaDecorImage, FALLBACK.midCtaDecorImage),
    midCtaDecorBg: api.midCtaDecorBg || FALLBACK.midCtaDecorBg,
    operationsRows: mapRow(api.operationsRows, FALLBACK.operationsRows),
    faqItems:
      api.faqItems && api.faqItems.length
        ? api.faqItems.map((item, i) => ({
            question: item.question ?? FALLBACK.faqItems[i]?.question,
            answer: item.answer ?? FALLBACK.faqItems[i]?.answer,
          }))
        : FALLBACK.faqItems,
    ctaInterest: api.ctaInterest || FALLBACK.ctaInterest,
    ctaButtonLabel: api.ctaButtonLabel || FALLBACK.ctaButtonLabel,
    ctaTitle: api.ctaTitle || FALLBACK.ctaTitle,
    ctaSubtitle: api.ctaSubtitle ?? FALLBACK.ctaSubtitle,
    ctaAccentColor: api.ctaAccentColor || FALLBACK.ctaAccentColor,
  }
}

function FeatureRow({ image, title, lead, intro, bullets, reversed }) {
  return (
    <div
      className={`flex flex-col md:flex-row py-spacing-7xl items-center justify-between xl:gap-spacing-9xl gap-spacing-7xl grid-block${reversed ? ' md:flex-row-reverse' : ''}`}
    >
      <div className="md:w-6/12 w-full">
        <img className="w-full rounded-2xl" src={image} alt={title} loading="lazy" />
      </div>
      <div className="md:w-6/12 w-full">
        <div className="max-w-[480px] grid gap-spacing-3xl">
          <h3 className="tracking-tight m-0">{title}</h3>
          <div className="hero-banner-des">
            {lead && (
              <p>
                <strong>{lead}</strong>
              </p>
            )}
            {intro && <p>{intro}</p>}
            <ul>
              {bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EvoneManagementPlatform() {
  const [data, setData] = useState(FALLBACK)

  useEffect(() => {
    let cancelled = false
    fetchEvonePage()
      .then((entry) => {
        if (cancelled) return
        setData(normalize(entry))
      })
      .catch(() => {
        // Strapi unreachable / not configured / unpublished — keep fallback.
      })
    return () => {
      cancelled = true
    }
  }, [])

  const faqAccordionItems = data.faqItems.map((item) => ({
    title: item.question,
    body: <div dangerouslySetInnerHTML={{ __html: item.answer }} />,
  }))

  return (
    <SolutionPageLayout
      documentTitle={data.documentTitle}
      ctaInterest={data.ctaInterest}
      ctaButtonLabel={data.ctaButtonLabel}
      ctaTitle={data.ctaTitle}
      ctaSubtitle={data.ctaSubtitle}
      ctaAccentColor={data.ctaAccentColor}
      ctaSubmitFn={submitPlatformDemoRequest}
    >
      <Hero
        tag={data.heroTag}
        title={data.heroTitle}
        subtitle={data.heroSubtitle}
        image={data.heroImage}
        imageAlt="Tableau de bord Evone"
        ctas={[{ to: data.heroCtaHref, label: data.heroCtaLabel, variant: 'primary' }]}
      />

      <section className="bg-white easy-to-setup relative py-spacing-7xl rounded-b-4xl">
        <div className="container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile">
          <div className="flex mx-auto flex-wrap xl:flex-nowrap xl:gap-spacing-8xl gap-spacing-6xl justify-center items-start">
            {data.featurePills.map((pill) => (
              <div
                key={pill.title}
                className="w-full grid gap-spacing-4xl text-center md:max-w-[276px] mx-auto"
              >
                <div className="w-16 h-16 bg-lime rounded-full flex items-center justify-center mx-auto p-3">
                  <img className="mx-auto" src={pill.icon} alt={pill.title} />
                </div>
                <div className="grid gap-spacing-xl">
                  <h6 className="m-0">{pill.title}</h6>
                  <p className="m-0">{pill.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="text-left-right-variant relative image-text-section bg-surface top-spacing">
        <div className="grid container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile gap-spacing-4xl image-text-block">
          {data.detailRows.map((row) => (
            <FeatureRow key={row.title} {...row} />
          ))}
        </div>
      </section>

      <CtaBanner
        title={data.midCtaTitle}
        body={data.midCtaBody}
        ctas={[{ to: data.midCtaHref, label: data.midCtaLabel, variant: 'secondary' }]}
        decorImage={data.midCtaDecorImage}
        decorBg={data.midCtaDecorBg}
      />

      <section className="text-left-right-variant relative image-text-section bg-surface top-spacing">
        <div className="grid container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile gap-spacing-4xl image-text-block">
          {data.operationsRows.map((row) => (
            <FeatureRow key={row.title} {...row} />
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
          <div className="view-header text-center">
            <div className="heading-block pb-12 grid gap-spacing-sm">
              <h4 className="tracking-tight m-0">FAQ</h4>
            </div>
          </div>
          <Accordion items={faqAccordionItems} variant="faq" defaultOpen={-1} />
        </div>
      </section>
    </SolutionPageLayout>
  )
}
