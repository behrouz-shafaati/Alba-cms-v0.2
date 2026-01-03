import SetLocalesForm from './form'
import InstallerSteper from '../InstallerStepper'

export default function InstallLocalesPage() {
  return (
    <div className=" flex flex-col items-center justify-center">
      <div className="w-full my-16">
        <InstallerSteper currentStep="locales" />
      </div>
      <div>
        <SetLocalesForm />
      </div>
    </div>
  )
}
