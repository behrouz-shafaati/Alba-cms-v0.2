import CreateSuperAdminForm from './form'
import InstallerSteper from '../InstallerStepper'
import { guardInstallStepBySegment } from '@/lib/config/guardInstallStep'

export default function InstallCreateAdminPage() {
  // guardInstallStepBySegment(step, locale)
  return (
    <div className=" flex flex-col items-center justify-center">
      <div className="w-full my-16">
        <InstallerSteper currentStep="admin" />
      </div>
      <div>
        <CreateSuperAdminForm />
      </div>
    </div>
  )
}
