// lib/installer/guardInstallStep.ts
import { redirect } from 'next/navigation'
import { resolveInstallStep } from './resolveInstallStep'
import { INSTALL_STEPS_ORDER } from './installStepsOrder'
import { INSTALL_STEP_ROUTES } from './installStepRoutes'
import { segmentToStep } from './segmentToStep'

export function guardInstallStepBySegment(
  currentSegment: string,
  locale?: string
) {
  const requiredStep = resolveInstallStep()
  const currentStep = segmentToStep(currentSegment)

  if (!currentStep) return

  const requiredIndex = INSTALL_STEPS_ORDER.indexOf(requiredStep)
  const currentIndex = INSTALL_STEPS_ORDER.indexOf(currentStep)

  if (currentIndex > requiredIndex) {
    const target = INSTALL_STEP_ROUTES[requiredStep]
    redirect(locale ? `/${locale}${target}` : target)
  }

  if (requiredStep === 'finish' && currentStep !== 'finish') {
    const target = INSTALL_STEP_ROUTES.finish
    redirect(locale ? `/${locale}${target}` : target)
  }
}
