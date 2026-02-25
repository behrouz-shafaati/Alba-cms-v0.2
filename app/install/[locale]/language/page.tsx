import SelectLanguageForm from './form'
import InstallerSteper from '../InstallerStepper'

export default function InstallLanguagePage() {
  return (
    <div className=" flex flex-col items-center justify-center">
      <div className="w-full my-16">
        <InstallerSteper currentStep="dashboard_lang" />
      </div>
      <div>
        <SelectLanguageForm />
      </div>
    </div>
  )
}
