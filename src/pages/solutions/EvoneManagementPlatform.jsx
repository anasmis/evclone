import MirroredPageLayout from '../MirroredPageLayout'
import bodyRaw from '../../migrated/pages/products/evone-management-platform.html?raw'

export default function EvoneManagementPlatform() {
  return (
    <MirroredPageLayout
      bodyRaw={bodyRaw}
      htmlPath="products/evone-management-platform.html"
      documentTitle="Plateforme Evone | EVplug"
    />
  )
}
