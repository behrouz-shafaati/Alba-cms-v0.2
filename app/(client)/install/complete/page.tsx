// 'use client'

// import { useState } from 'react'
// import { readState, isInstallComplete, resetState } from '@/lib/install/state'
// import { writeConfig, AppConfig } from '@/lib/config/config'

// export default function CompleteStep() {
//   const [done, setDone] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const handleFinish = async () => {
//     try {
//       const state = readState()
//       if (!state || !isInstallComplete(state)) {
//         setError('Installation not complete yet.')
//         return
//       }

//       const config: AppConfig = {
//         locale: state.language?.value || 'en',
//         db: { uri: state.database?.value || '' },
//         admin: { email: state.admin?.value?.email || '' },
//       }

//       writeConfig(config)
//       resetState()
//       setDone(true)
//     } catch (err: any) {
//       setError(err.message)
//     }
//   }

//   if (done) {
//     return (
//       <div className="text-green-600 text-xl font-bold">
//         Installation Completed Successfully!
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col gap-4">
//       <h1 className="text-2xl font-bold">Finalize Installation</h1>
//       <button
//         onClick={handleFinish}
//         className="px-4 py-2 bg-green-500 text-white rounded"
//       >
//         Finish & Save Config
//       </button>
//       {error && <p className="text-red-500">{error}</p>}
//     </div>
//   )
// }
export const dynamic = 'force-static'

export default function Page() {
  return (
    <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <h1>Alba CMS</h1>
      <p>About Page</p>
    </main>
  )
}
