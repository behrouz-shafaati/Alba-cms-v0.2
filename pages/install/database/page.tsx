// import { writeState } from '@/lib/install/state'
// import { connectMongo } from '@/lib/db/mongoose'

// export default function DatabaseStep() {
//   async function setMongo(formData: FormData) {
//     'use server'
//     const uri = formData.get('uri') as string
//     try {
//       await connectMongo(uri) // تست اتصال
//       writeState({ database: { done: true, value: uri } })
//     } catch (err) {
//       throw new Error('Cannot connect to MongoDB: ' + err.message)
//     }
//   }

//   return (
//     <form action={setMongo} className="flex flex-col gap-4">
//       <h1 className="text-2xl font-bold">MongoDB Connection</h1>
//       <input
//         name="uri"
//         type="text"
//         placeholder="mongodb://localhost:27017/mydb"
//         className="border rounded px-2 py-1"
//         required
//       />
//       <button
//         type="submit"
//         className="px-4 py-2 bg-blue-500 text-white rounded"
//       >
//         Save & Test
//       </button>
//     </form>
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
