import SetDatabaseForm from './form'
import InstallerSteper from '../InstallerStepper'

export default function InstallDatabasePage() {
  return (
    <div className=" flex flex-col items-center justify-center">
      <div className="w-full my-16">
        <InstallerSteper currentStep="variables" />
      </div>
      <div>
        <SetDatabaseForm />
      </div>
    </div>
  )
}
