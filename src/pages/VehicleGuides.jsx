import MirrorShell from './MirrorShell'
import Breadcrumb from '../components/sections/Breadcrumb'
import heroIcon from '../migrated/assets/vehicle-guides/hero.svg'

const EXTERNAL_GUIDE_URL = 'https://www.maborneelectrique.ma/vehicules-electriques'

export default function VehicleGuides() {
  return (
    <MirrorShell documentTitle="Guides des vehicules electriques | EVplug">
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb current="Guides des vehicules" />

            {/* Hero */}
            <section className="two-card-layout">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto md:py-spacing-7xl pt-spacing-7xl pb-spacing-4xl">
                <div className="grid xl:grid-flow-col gap-spacing-3xl items-stretch xl:grid-cols-3">
                  <div
                    className="m-0 xl:col-span-2 rounded-2xl md:p-spacing-6xl py-spacing-6xl px-spacing-4xl grid gap-spacing-4xl items-center"
                    style={{ backgroundColor: '#F5F1EB' }}
                  >
                    <div className="grid gap-spacing-xl auto-rows-max">
                      <h1 className="font-TTCommons mb-0">Guides des vehicules electriques</h1>
                      <div className="m-0">
                        <p>
                          Decouvrez les guides complets des vehicules electriques disponibles au Maroc — recharge,
                          performances, couts et bien plus.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="hidden md:!grid rounded-2xl md:py-spacing-4xl md:px-spacing-6xl p-spacing-2xl items-center justify-center"
                    style={{ backgroundColor: '#163E4C' }}
                  >
                    <img
                      src={heroIcon}
                      alt="vehicle-guides-icon"
                      className="max-w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* CTA to external catalogue */}
            <section className="vehicle-guides-cta">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto py-spacing-7xl">
                <div
                  className="rounded-2xl py-spacing-7xl px-spacing-4xl grid gap-spacing-4xl items-center text-center"
                  style={{ backgroundColor: '#F5F1EB' }}
                >
                  <h2 className="font-TTCommons mb-0">
                    Parcourez tous les vehicules electriques disponibles au Maroc
                  </h2>
                  <p className="font-lg m-0 max-w-3xl mx-auto">
                    Retrouvez le catalogue complet, mis a jour en continu, des vehicules electriques
                    et hybrides rechargeables sur MaBorneElectrique.
                  </p>
                  <div>
                    <a
                      href={EXTERNAL_GUIDE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{
                        display: 'inline-block',
                        padding: '1.25rem 2.5rem',
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        borderRadius: '9999px',
                      }}
                    >
                      Voir tous les vehicules electriques
                      <i className="fa-solid fa-arrow-right ms-2" />
                    </a>
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
