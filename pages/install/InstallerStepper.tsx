'use client'
import { PathStepper } from '@/components/other/PathStepper'
import { useLocale } from '@/hooks/useLocale'

type Props = {
  currentStep: 'dashboard_lang' | 'db' | 'admin' | 'locales' | 'finish'
}

export default function InstallerSteper({ currentStep }: Props) {
  const t = useLocale()
  const installSteps = [
    { key: 'dashboard_lang', title: t.installer.steps.dashboard_lang.title },
    { key: 'db', title: t.installer.steps.db.title },
    { key: 'admin', title: t.installer.steps.admin.title },
    { key: 'locales', title: t.installer.steps.suported_lang.title },
    { key: 'finish', title: t.installer.steps.finish.title },
  ]

  return <PathStepper steps={installSteps} currentStep={currentStep} />
}
