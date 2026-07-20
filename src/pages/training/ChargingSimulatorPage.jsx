import MirrorShell from '../MirrorShell'
import Breadcrumb from '../../components/sections/Breadcrumb'
import HomeChargingSimulator from '../../components/sections/HomeChargingSimulator'

export default function ChargingSimulatorPage() {
  return (
    <MirrorShell documentTitle="Simulateur de recharge | EVplug Maroc">
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb current="Simulateur de recharge" />
            <HomeChargingSimulator />
          </div>
        </article>
      </div>
    </MirrorShell>
  )
}
