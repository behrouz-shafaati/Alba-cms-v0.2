import CreateSuperAdminForm from './form'
import InstallerSteper from '../InstallerStepper'
import { guardInstallStepBySegment } from '@/lib/config/guardInstallStep'
import { getSettingsAction } from '@/lib/features/settings/actions'

export default async function InstallCreateAdminPage() {
  // guardInstallStepBySegment(step, locale)
  const settings = await getSettingsAction()
  return (
    <div className=" flex flex-col items-center justify-center">
      <div className="w-full my-16">
        <InstallerSteper currentStep="admin" />
      </div>
      <div>
        <CreateSuperAdminForm settings={settings} />
      </div>
    </div>
  )
}
