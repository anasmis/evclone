import { Link } from 'react-router-dom'
import MirrorShell from './MirrorShell'
import CardsCarousel from '../components/common/CardsCarousel'
import BrandsMarquee from '../components/common/BrandsMarquee'
import CtaBanner from '../components/sections/CtaBanner'
import hero from '../migrated/assets/home/hero.webp'
import usp1 from '../migrated/assets/home/usp-1.svg'
import usp2 from '../migrated/assets/home/usp-2.svg'
import usp3 from '../migrated/assets/home/usp-3.svg'
import usp4 from '../migrated/assets/home/usp-4.svg'
import carousel1 from '../migrated/assets/home/carousel-1.webp'
import carousel2 from '../migrated/assets/home/carousel-2.webp'
import carousel3 from '../migrated/assets/home/carousel-3.webp'
import iconHome from '../migrated/assets/home/icon-home.svg'
import iconInstallation from '../migrated/assets/home/icon-installation.svg'
import iconAward from '../migrated/assets/home/icon-award.svg'
import iconTick from '../migrated/assets/home/icon-tick.svg'
import benefit1 from '../migrated/assets/home/benefit-1.svg'
import benefitWarranty from '../migrated/assets/home/benefit-warranty.svg'
import benefitVehicle from '../migrated/assets/home/benefit-vehicle.svg'
import benefitFeedback from '../migrated/assets/home/benefit-feedback.svg'
import twoCardsImg from '../migrated/assets/home/twocards-img.png'
import iconStarWhite from '../migrated/assets/home/icon-star-white.svg'
import iconSubscription from '../migrated/assets/home/icon-subscription.svg'
import iconChargeWhite from '../migrated/assets/home/icon-charge-white.svg'
import duo1 from '../migrated/assets/home/duo-1.webp'
import duo2 from '../migrated/assets/home/duo-2.webp'

import audi from '../migrated/assets/home/brands/audi.svg'
import bmw from '../migrated/assets/home/brands/bmw.svg'
import chevrolet from '../migrated/assets/home/brands/chevrolet.png'
import citroen from '../migrated/assets/home/brands/citroen.png'
import cupra from '../migrated/assets/home/brands/cupra.png'
import ds from '../migrated/assets/home/brands/ds.png'
import fiat from '../migrated/assets/home/brands/fiat.svg'
import ford from '../migrated/assets/home/brands/ford.svg'
import genesis from '../migrated/assets/home/brands/genesis.png'
import honda from '../migrated/assets/home/brands/honda.png'
import hyundai from '../migrated/assets/home/brands/hyundai.png'
import jaguar from '../migrated/assets/home/brands/jaguar.png'
import jeep from '../migrated/assets/home/brands/jeep.svg'
import kia from '../migrated/assets/home/brands/kia.svg'
import landRover from '../migrated/assets/home/brands/land-rover.svg'
import maxus from '../migrated/assets/home/brands/maxus.png'
import mazda from '../migrated/assets/home/brands/mazda.png'
import mg from '../migrated/assets/home/brands/mg.png'
import mini from '../migrated/assets/home/brands/mini.png'
import mitsubishi from '../migrated/assets/home/brands/mitsubishi.png'
import nissan from '../migrated/assets/home/brands/nissan.png'
import peugeot from '../migrated/assets/home/brands/peugeot.png'
import porsche from '../migrated/assets/home/brands/porsche.png'
import renault from '../migrated/assets/home/brands/renault.png'
import seat from '../migrated/assets/home/brands/seat.png'
import skoda from '../migrated/assets/home/brands/skoda.png'
import smart from '../migrated/assets/home/brands/smart.png'
import subaru from '../migrated/assets/home/brands/subaru.png'
import tesla from '../migrated/assets/home/brands/tesla.png'
import toyota from '../migrated/assets/home/brands/toyota.svg'

const PAGE_CLASSES = 'path-frontpage page-node-type-page d-flex flex-column'

const usps = [
  { icon: usp1, label: 'Plus de 200 projets accompagnes au Maroc' },
  { icon: usp2, label: 'Accompagnement de flottes et de sites multi-usages' },
  { icon: usp3, label: 'Expertise locale en deploiement et maintenance' },
  { icon: usp4, label: 'Solutions adaptees aux usages reels' },
]

const carousel = [
  {
    pillIcon: iconHome,
    pillLabel: 'Domicile',
    title: 'Installer une borne EVplug',
    lead: 'Des bornes partenaires fiables, choisies par de nombreux conducteurs EV au Maroc.',
    description: "Commandez votre borne partenaire sur la marketplace EVplug et profitez d'une recharge simple au quotidien.",
    image: carousel1,
    tagIcon: iconAward,
    tag: 'Solutions appreciees par les conducteurs EV au Maroc',
    cta: { to: '/home/home-charging', label: 'En savoir plus' },
  },
  {
    pillIcon: iconHome,
    pillLabel: 'Entreprises',
    title: 'Recharge EVplug pour entreprises',
    lead: 'Solutions de recharge sur site pour vos equipes et visiteurs.',
    description: "EVplug accompagne votre entreprise de l'etude a l'exploitation avec supervision, maintenance et gestion intelligente des usages.",
    image: carousel2,
    tagIcon: iconTick,
    tag: 'Infrastructure dimensionnee pour votre activite',
    cta: { to: '/solutions/entreprise', label: 'En savoir plus' },
  },
  {
    pillIcon: iconInstallation,
    pillLabel: 'Installation',
    title: 'Fiabilite et support, inclus des le depart',
    description:
      "Une installation EVplug qualifiee rend la mise en service simple, et avec 90 % des clients eligibles a l'installation standard, vous commencez a recharger sans surprise.",
    image: carousel3,
    tagIcon: iconAward,
    tag: 'Installation professionnelle EVplug',
    cta: { to: '/installation', label: "Decouvrir le service d'installation" },
  },
]

const stories = [
  {
    quote:
      "L'équipe EVplug a installé six bornes dans notre résidence en moins de trois semaines. L'intervention a été propre, soignée, et nos copropriétaires apprécient enfin un service à la hauteur de leurs attentes.",
    name: 'Yasmine El Amrani',
    role: "Directrice d'exploitation, Résidence Anfa Premium · Casablanca",
  },
  {
    quote:
      "Nos clients européens arrivent de plus en plus en véhicule électrique. Installer une borne EVplug devant le riad est devenu un vrai argument commercial, et le suivi technique reste toujours réactif.",
    name: 'Mehdi Ouhmad',
    role: 'Gérant, Riad Tafraout · Marrakech',
  },
  {
    quote:
      'Nous voulions électrifier le parking de notre cabinet sans nous tromper de partenaire. EVplug nous a accompagnés du diagnostic à la mise en service, avec une vraie pédagogie sur les usages au quotidien.',
    name: 'Salma Bennis',
    role: 'Responsable développement durable, Cabinet El Houmad & Associés · Rabat',
  },
  {
    quote:
      "Gérer une flotte d'utilitaires électriques au quotidien demande une infrastructure fiable. Avec EVplug la maintenance est rapide, et nos chauffeurs partent chaque matin avec une recharge complète.",
    name: 'Rachid Aït Bouzid',
    role: 'Responsable de flotte, Atlas Express Logistique · Tanger',
  },
]

const benefits = [
  { icon: benefit1, label: 'Des puissances adaptees a la majorite des habitations au Maroc' },
  { icon: iconInstallation, label: 'Installation standard EVplug incluse' },
  { icon: benefitWarranty, label: 'Garantie complete sur toutes les bornes' },
  { icon: benefitVehicle, label: 'Compatibilite garantie avec toutes les marques de vehicules electriques' },
  { icon: benefitFeedback, label: "Compatible avec tous les fournisseurs d'energie" },
  { icon: usp2, label: 'Tranquillite assuree avec un support 24/7' },
]

const brands = [
  ford, bmw, jeep, toyota, landRover, kia, audi, fiat, citroen,
  ds, chevrolet, cupra, genesis, honda, hyundai, jaguar, maxus,
  mazda, mg, mini, mitsubishi, nissan, peugeot, porsche, renault,
  seat, skoda, smart, subaru, tesla,
]

export default function HomePage() {
  return (
    <MirrorShell pageClasses={PAGE_CLASSES} documentTitle="EVplug Maroc — Mobilité électrique au Maroc">
      {/* Hero */}
      <section className="relative header-banner-section bg-white">
        <div className="mx-auto md:py-spacing-7xl py-spacing-4xl">
          <div className="grid md:grid-cols-2 gap-spacing-4xl">
            <div className="grid gap-spacing-4xl ev-charger-content auto-rows-max">
              <div className="hero-left-block pr-spacing-4xl md:pr-spacing-none">
                <div className="bg-blue-dianne rounded-r-2xl py-spacing-6xl px-spacing-4xl lg:pl-spacing-7xl xl:pl-spacing-9xl lg:pr-spacing-6xl md:pl-spacing-7xl">
                  <div className="md:ml-auto max-w-[536px] grid gap-spacing-4xl auto-rows-max">
                    <h1 className="m-0 text-pear font-PosterCutNeue uppercase font-normal font-4xl xl:font-8xl">
                      Mobilité électrique au Maroc.
                    </h1>
                    <div className="lg:font-lg hero-banner-des m-0 font-base">
                      <p>
                        Accélérez votre transition vers une conduite plus propre avec des solutions de recharge
                        simples, fiables et adaptées au marché marocain : à la maison, en entreprise et sur la route.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-spacing-xl">
                      <Link className="btn btn-secondary font-base md:font-lg" to="/home/home-charging">
                        Découvrir nos solutions
                      </Link>
                      <Link className="btn btn-secondary-outline font-base md:font-lg" to="/contact-us">
                        Parler à un conseiller
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="ev-charger pl-spacing-4xl md:pl-spacing-none">
              <img className="rounded-l-2xl" src={hero} alt="Borne EVplug" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      {/* USP cards */}
      <section className="relative bento-box-section bg-white rounded-b-4xl">
        <div className="grid container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto md:pb-spacing-9xl pb-spacing-7xl md:gap-spacing-4xl bento-box-block">
          <div className="usp-section">
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-spacing-4xl justify-center card-usp-row">
              {usps.map((u) => (
                <div key={u.label} className="flex gap-spacing-4xl card-usp-column flex-wrap justify-center">
                  <div className="bg-surface p-spacing-3xl rounded-2xl flex flex-col justify-between w-full min-h-[204px]">
                    <div className="grid justify-end">
                      <div className="w-16 h-16 bg-lime rounded-full flex items-center justify-center mb-8">
                        <img className="w-8 h-8" src={u.icon} alt={u.label} />
                      </div>
                    </div>
                    <p className="font-2xl font-bold m-0">{u.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal carousel */}
      <section className="horizontal-carousel-new-section relative overflow-hidden md:pb-spacing-7xl pb-spacing-4xl">
        <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto grid gap-spacing-7xl w-full md:pt-spacing-7xl md:pb-spacing-6xl py-spacing-4xl">
          <div className="grid gap-spacing-6xl grid-flow-col justify-between items-end">
            <div className="max-w-[480px] grid gap-spacing-3xl relative">
              <h3 className="tracking-tight m-0">L'electromobilite au service du Maroc.</h3>
            </div>
          </div>
        </div>
        <div className="horizontal-new-carousel-main container-max-width-tablet mx-auto xl:mx-none container-padding-tablet container-padding-mobile">
          <CardsCarousel ariaLabel="L'electromobilite au service du Maroc">
            {carousel.map((item) => (
              <div key={item.title} className="item">
                <div className="flex md:flex-nowrap flex-wrap md:gap-[25px] gap-spacing-xl">
                  <div className="horizontal-slider-new-content md:w-6/12 w-full">
                    <div className="bg-blue-dianne rounded-2xl grid gap-spacing-4xl text-white p-spacing-6xl horizontal-card auto-rows-max h-full">
                      <div className="grid gap-spacing-2xl">
                        <div className="flex">
                          <span className="pill-custom flex items-center gap-spacing-sm cursor-auto">
                            <img className="!w-[24px] h-[24px]" src={item.pillIcon} loading="lazy" alt={item.pillLabel} />
                            {item.pillLabel}
                          </span>
                        </div>
                        <h4 className="m-0 font-4xl !hidden sm:!block">{item.title}</h4>
                        <h5 className="m-0 font-3xl !block sm:!hidden">{item.title}</h5>
                        {item.lead && (
                          <div className="text-block vertical-carousel-des font-lg font-semibold m-0">
                            <p>{item.lead}</p>
                          </div>
                        )}
                        <div className="text-block vertical-carousel-des m-0">
                          <p>{item.description}</p>
                        </div>
                      </div>
                      <div className="flex justify-start gap-spacing-xl flex-wrap">
                        <Link
                          to={item.cta.to}
                          className="btn btn-secondary-outline font-base md:px-spacing-md lg:px-spacing-2xl px-spacing-lg"
                        >
                          {item.cta.label}
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="horizontal-slider-new-image relative md:w-6/12 w-full">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full object-cover rounded-xl lg:max-w-[484px] lg:h-[340px] md:max-w-[272px] md:h-[363px] max-w-full h-[208px]"
                      loading="lazy"
                    />
                    <div className="image-tag grid-flow-col">
                      <div className="w-[40px] h-[40px]">
                        <img className="w-[40px] h-[40px]" src={item.tagIcon} alt={item.tag} />
                      </div>
                      <div className="md:font-lg font-base font-semibold md:max-w-[190px] max-w-full w-full m-0">
                        <p>
                          <span style={{ whiteSpace: 'pre-wrap' }}>{item.tag}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardsCarousel>
        </div>
      </section>

      {/* Customer stories */}
      <section className="customer-stories-carousel-wrapper relative">
        <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto pt-spacing-7xl gap-spacing-4xl">
          <div className="grid gap-spacing-6xl grid-flow-col justify-between items-end mb-spacing-6xl">
            <div className="max-w-[480px] grid gap-spacing-3xl">
              <h3 className="tracking-tight m-0">Ce que disent nos clients au Maroc</h3>
            </div>
          </div>
        </div>
        <div className="video-carousel-main xl:pb-spacing-9xl pb-spacing-7xl container-padding-tablet container-padding-mobile">
          <div className="container-max-width-desktop container-max-width-tablet mx-auto grid md:grid-cols-2 gap-spacing-4xl">
            {stories.map((s) => (
              <div key={s.name} className="customer-story-item item">
                <div className="video-card-wrapper overflow-hidden relative rounded-2xl">
                  <div className="relative bg-surface" style={{ minHeight: 360, padding: 32 }}>
                    <div
                      className="relative flex flex-col justify-between gap-spacing-2xl"
                      style={{ zIndex: 50, minHeight: 296 }}
                    >
                      <div
                        aria-hidden="true"
                        style={{
                          fontFamily: "Georgia, 'Times New Roman', serif",
                          fontSize: 72,
                          lineHeight: 0.6,
                          color: 'var(--color-lime)',
                          margin: 0,
                        }}
                      >
                        “
                      </div>
                      <p
                        style={{
                          color: '#1a1a1a',
                          fontSize: 17,
                          lineHeight: 1.55,
                          margin: 0,
                          flex: 1,
                          fontWeight: 600,
                        }}
                      >
                        {s.quote}
                      </p>
                      <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: 16 }}>
                        <h3 style={{ color: '#1a1a1a', fontSize: 18, fontWeight: 600, margin: 0 }}>{s.name}</h3>
                        <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: 14, margin: '4px 0 0' }}>{s.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits vertical */}
      <section className="relative benefits-vertical bg-white rounded-t-3xl top-spacing">
        <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:pt-spacing-9xl xl:pb-spacing-6xl py-spacing-7xl gap-spacing-4xl vertical-main">
          <div className="grid xl:grid-flow-col justify-between items-start gap-spacing-7xl">
            <div className="max-w-[480px] grid gap-spacing-3xl xl:sticky xl:top-[160px] pr-spacing-xl">
              <h3 className="tracking-tight m-0">Notre engagement EVplug</h3>
              <div className="hero-banner-des m-0">
                <p>Notre promesse : un accompagnement clair et fiable, du premier contact a la mise en service.</p>
              </div>
            </div>
            <div className="benefit-vertical-desktop grid grid-cols-2 gap-spacing-3xl w-full xl:max-w-[640px]">
              {benefits.map((b) => (
                <div key={b.label} className="flex gap-spacing-3xl card-usp-column flex-wrap justify-center">
                  <div className="bg-surface p-spacing-3xl rounded-2xl flex flex-col justify-between gap-spacing-4xl w-full">
                    <div className="grid justify-end">
                      <div className="w-16 h-16 bg-lime rounded-full flex items-center justify-center mb-6">
                        <img className="w-8 h-8" src={b.icon} alt={b.label} loading="lazy" />
                      </div>
                    </div>
                    <h6 className="m-0">{b.label}</h6>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brand logo strip */}
      <section className="relative logo-spread-section bg-white rounded-b-4xl xl:pt-spacing-7xl xl:pb-spacing-9xl py-spacing-7xl gap-spacing-4xl">
        <div className="max-w-[590px] mx-auto w-full text-center mb-spacing-6xl px-spacing-xl">
          <h3 className="tracking-tight m-0">Compatible avec les principales marques de vehicules electriques</h3>
        </div>
        <div className="container-max-width-desktop container-max-width-tablet mx-auto">
          <div className="grid gap-spacing-3xl">
            <BrandsMarquee logos={brands.slice(0, 15)} direction="left" speed={50} />
            <BrandsMarquee logos={brands.slice(15)} direction="right" speed={50} />
          </div>
        </div>
      </section>

      {/* Image with two cards */}
      <section className="relative image-with-two-cards bg-surface">
        <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-7xl md:pt-spacing-7xl py-spacing-4xl">
          <div className="flex gap-spacing-4xl flex-col-reverse xl:flex-row xl:flex-nowrap xl:grid-flow-col">
            <div className="rounded-2xl overflow-hidden xl:w-5/12">
              <img
                src={twoCardsImg}
                alt="EVplug en action"
                className="w-full h-full object-cover md:aspect-3/2 aspect-2/1"
              />
            </div>
            <div className="flex xl:w-7/12 flex-wrap">
              <div className="max-w-[480px] grid gap-spacing-2xl mb-12">
                <h3 className="tracking-tight m-0">Deux options simples pour commencer la recharge</h3>
                <div className="m-0">
                  <p>
                    Choisissez la solution adaptee a votre usage : installation a domicile ou carte EV rechargeable
                    pour acceder a notre reseau de bornes.
                  </p>
                </div>
              </div>
              <div className="grid gap-spacing-4xl md:grid-flow-col two-cards-column md:grid-cols-2">
                <div className="bg-blue-dianne col text-white rounded-2xl p-spacing-3xl gap-spacing-4xl relative">
                  <span className="absolute -top-[24px] right-4 text-black font-semibold py-spacing-sm px-spacing-md rounded-md text-lg text-center bg-pear">
                    Installation a domicile
                  </span>
                  <div className="gap-spacing-2xl h-full justify-between flex flex-col">
                    <div className="grid gap-spacing-xl">
                      <h6 className="text-white">Installer une borne EVplug</h6>
                      <div className="text-white image-two-card-des m-0">
                        <p>Installez une borne fiable chez vous avec l'accompagnement EVplug.</p>
                      </div>
                    </div>
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start gap-spacing-sm">
                        <span className="inline-flex shrink-0">
                          <img src={iconStarWhite} alt="" className="w-6 h-6 object-contain" />
                        </span>
                        <div>
                          <p className="font-semibold mb-1">Un achat unique, une fiabilite au quotidien.</p>
                          <div className="text-white">
                            <p>
                              Technologie de recharge fiable pour votre domicile avec garantie selon la borne
                              partenaire choisie.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex mt-auto">
                      <Link to="/home/home-charging" className="font-base btn-secondary w-full">
                        Voir l'offre domicile
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-dianne col text-white rounded-2xl p-spacing-3xl gap-spacing-4xl relative">
                  <span className="absolute -top-[24px] right-4 text-black font-semibold py-spacing-sm px-spacing-md rounded-md text-lg text-center bg-pear">
                    Carte EV rechargeable
                  </span>
                  <div className="gap-spacing-2xl h-full justify-between flex flex-col">
                    <div className="grid gap-spacing-xl">
                      <h6 className="text-white">Carte EVplug</h6>
                      <div className="text-white image-two-card-des m-0">
                        <p>Rechargez votre carte EV et chargez facilement sur notre reseau de bornes partenaires.</p>
                      </div>
                    </div>
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start gap-spacing-sm">
                        <span className="inline-flex shrink-0">
                          <img src={iconSubscription} alt="" className="w-6 h-6 object-contain" />
                        </span>
                        <div>
                          <p className="font-semibold mb-1">Recharge flexible selon vos besoins</p>
                          <div className="text-white">
                            <p>Ajoutez du credit a votre rythme et utilisez votre carte quand vous en avez besoin.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-spacing-sm">
                        <span className="inline-flex shrink-0">
                          <img src={iconChargeWhite} alt="" className="w-6 h-6 object-contain" />
                        </span>
                        <div>
                          <p className="font-semibold mb-1">Recharge intelligente qui vous recompense</p>
                          <div className="text-white">
                            <p>Accedez a notre reseau de bornes et suivez facilement vos sessions de recharge.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex mt-auto">
                      <Link to="/products/carte-evplug" className="font-base btn-secondary w-full">
                        Voir l'offre carte EV
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image duo */}
      <section className="relative image-duo w-full grid place-items-center md:py-spacing-9xl py-[180px] overflow-hidden">
        <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile relative w-full mx-auto">
          <div className="absolute bg-blue-dianne w-full h-full rounded-2xl z-0 max-w-[1200px] inset-0 mx-auto bg-custom bg-custom-main" />
          <div className="relative grid grid-cols-2 gap-spacing-3xl max-w-[400px] md:max-w-[960px] mx-auto bg-custom">
            <div className="relative first-picture top-[100px]">
              <img src={duo1} alt="EVplug" className="rounded-2xl w-full aspect-7/8 object-cover" />
            </div>
            <div className="relative first-picture -top-[100px]">
              <img src={duo2} alt="EVplug" className="rounded-2xl w-full aspect-7/8 object-cover" />
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        title="L'electromobilite pour tous."
        ctas={[{ to: '/about', label: 'Decouvrir notre mission', variant: 'secondary' }]}
      />
    </MirrorShell>
  )
}
