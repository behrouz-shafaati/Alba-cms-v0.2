import InstallerSteper from '../InstallerStepper'
import InstallFinish from './InstallFinish'

export default function InstallFinishPage() {
  return (
    <div className=" flex flex-col items-center justify-center">
      <div className="w-full my-16">
        <InstallerSteper currentStep="finish" />
      </div>
      <div>
        <InstallFinish />
      </div>
    </div>
  )
}
