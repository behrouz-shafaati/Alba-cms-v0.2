import CreateSuperAdminForm from './form'
import InstallerSteper from '../InstallerStepper'

export default function InstallCreateAdminPage() {
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
