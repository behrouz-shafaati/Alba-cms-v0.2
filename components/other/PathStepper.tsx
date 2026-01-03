type Step = {
  key: string
  title: string
  icon?: string
}

type Props = {
  steps: Step[]
  currentStep: string
}

export function PathStepper({ steps, currentStep }: Props) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep)

  return (
    <div className="w-full max-w-3xl mx-auto">
      <ol className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isActive = index === currentIndex

          return (
            <li
              key={step.key}
              className="flex-1 flex flex-col items-center text-center"
            >
              {/* line */}
              <div
                className={`h-0.5 w-full mb-4 ${
                  isCompleted ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              />

              {/* circle */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2
                ${
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : isActive
                    ? 'border-emerald-500 text-emerald-500'
                    : 'border-gray-300 text-gray-400'
                }`}
              >
                {isCompleted ? '✓' : index + 1}
              </div>

              {/* title */}
              <span
                className={`mt-3 text-sm font-medium
                ${isActive ? 'text-emerald-600' : 'text-gray-500'}`}
              >
                {step.title}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
