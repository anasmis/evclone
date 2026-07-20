import { useLocation, useNavigate } from 'react-router-dom'
import MirrorShell from '../MirrorShell'
import Breadcrumb from '../../components/sections/Breadcrumb'
import HomeChargingSimulator from '../../components/sections/HomeChargingSimulator'
import CatalogComparator from '../../components/comparison/CatalogComparator'
import FloatingCtaForm from '../../components/common/FloatingCtaForm'
import { submitHomeChargingRequest } from '../../lib/api/strapi'

const tools = [
  { id: 'simulator', label: 'Simulateur de recharge', shortLabel: 'Simulateur', icon: 'fa-bolt' },
  { id: 'products', label: 'Comparateur de bornes', shortLabel: 'Bornes', icon: 'fa-charging-station' },
  { id: 'vehicles', label: 'Comparateur de véhicules', shortLabel: 'Véhicules', icon: 'fa-car-side' },
]

export default function ChargingSimulatorPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const hashTool = location.hash.replace('#', '')
  const activeTool = tools.some((tool) => tool.id === hashTool) ? hashTool : 'simulator'

  const selectTool = (toolId) => {
    navigate({ pathname: location.pathname, hash: toolId })
  }

  return (
    <MirrorShell documentTitle="Simulateurs et comparateurs | EVplug Maroc">
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb current="Simulateurs et comparateurs" />
            <section className="bg-surface pt-spacing-5xl pb-spacing-xl">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto grid gap-spacing-3xl">
                <div className="text-center max-w-[840px] mx-auto grid gap-spacing-md">
                  <span className="text-sm font-semibold uppercase tracking-wide text-blue-dianne/55">Les outils EVplug</span>
                  <h1 className="m-0 tracking-tight">Choisissez, calculez, comparez</h1>
                  <p className="m-0 text-blue-dianne/70">Trois outils simples pour trouver la solution de mobilité électrique adaptée à vos besoins.</p>
                </div>
                <div
                  role="tablist"
                  aria-label="Outils de comparaison et de simulation"
                  className="grid grid-cols-3 gap-spacing-sm rounded-3xl bg-white p-spacing-sm shadow-[0_16px_40px_-32px_rgba(22,62,76,0.8)]"
                >
                  {tools.map((tool) => {
                    const active = tool.id === activeTool
                    return (
                      <button
                        type="button"
                        role="tab"
                        key={tool.id}
                        id={`tool-tab-${tool.id}`}
                        aria-selected={active}
                        aria-controls={`tool-panel-${tool.id}`}
                        onClick={() => selectTool(tool.id)}
                        className={`min-h-20 md:min-h-24 rounded-2xl px-spacing-sm md:px-spacing-xl py-spacing-md flex flex-col md:flex-row items-center justify-center gap-spacing-sm md:gap-spacing-md font-bold transition-colors ${
                          active ? 'bg-blue-dianne text-white' : 'text-blue-dianne hover:bg-surface'
                        }`}
                      >
                        <i className={`fa-solid ${tool.icon} text-lg md:text-xl ${active ? 'text-pear' : 'text-lime'}`} aria-hidden="true" />
                        <span className="hidden md:inline">{tool.label}</span>
                        <span className="md:hidden text-xs leading-tight">{tool.shortLabel}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </section>

            <div
              role="tabpanel"
              id={`tool-panel-${activeTool}`}
              aria-labelledby={`tool-tab-${activeTool}`}
            >
              {activeTool === 'simulator' && <HomeChargingSimulator />}
              {activeTool === 'products' && <CatalogComparator type="products" />}
              {activeTool === 'vehicles' && <CatalogComparator type="vehicles" />}
            </div>
          </div>
        </article>
      </div>
      <FloatingCtaForm
        buttonLabel="Recharger chez moi"
        title="Recharge à domicile"
        subtitle="Installation d'une borne à votre domicile : indiquez votre besoin, un conseiller EVplug vous recontacte sous 24h."
        defaultInterest="Installation à domicile"
        accentColor="#c8d72d"
        submitFn={submitHomeChargingRequest}
      />
    </MirrorShell>
  )
}
