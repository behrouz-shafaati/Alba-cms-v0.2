// 'use client' // لازم برای useActionState

// import { writeState } from '@/lib/install/state'
// import { connectMongo } from '@/lib/db/mongoose'
// import { User } from '@/lib/db/models/user'
// import { useActionState } from 'react'

// export default function AdminStep() {
//   async function setAdmin(formData: FormData) {
//     'use server'
//     const email = formData.get('email') as string
//     const password = formData.get('password') as string

//     if (!email || !password) throw new Error('Email and password are required')

//     // اتصال به Mongo
//     await connectMongo()

//     // ایجاد admin user
//     await User.create({ email, password })

//     // ثبت مرحله admin در state نصب
//     writeState({ admin: { done: true } })
//   }

//   const actionState = useActionState(setAdmin)

//   return (
//     <form action={setAdmin} className="flex flex-col gap-4">
//       <h1 className="text-2xl font-bold">Create Admin User</h1>
//       <input
//         name="email"
//         type="email"
//         placeholder="admin@example.com"
//         className="border rounded px-2 py-1"
//         required
//       />
//       <input
//         name="password"
//         type="password"
//         placeholder="Password"
//         className="border rounded px-2 py-1"
//         required
//       />
//       <button
//         type="submit"
//         className="px-4 py-2 bg-blue-500 text-white rounded"
//         disabled={actionState.pending}
//       >
//         {actionState.pending ? 'Saving...' : 'Save Admin'}
//       </button>
//       {actionState.error && (
//         <p className="text-red-500">{actionState.error.message}</p>
//       )}
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
