'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ShieldQuestionIcon } from 'lucide-react'
import { useSessionUser } from '@/components/context/SessionContext'
import { updateUsersSettings } from './actions'
import { FormActionState, Option } from '@/lib/types'
import { Settings } from '../interface'
import authorize from '@/lib/utils/authorize'
import { toast } from 'sonner'
import AccessDenied from '@/components/other/access-denied'
import { Role } from '../../role/interface'
import roleCtrl from '../../role/controller'
import SubmitButton from '@/components/input/submit-button'
import MultipleSelect from '@/components/input/multiple-select'

interface FormProps {
  settings: Settings
}

export const FormUsers: React.FC<FormProps> = ({ settings }) => {
  const user = useSessionUser()
  const loginedUserRoles = user?.roles || []

  const canModerate = authorize(loginedUserRoles, 'settings.moderate.any')
  const formRef = useRef<HTMLFormElement>(null)
  const initialState: FormActionState = {
    message: null,
    errors: {},
    success: true,
    values: settings?.users,
  }
  const [state, dispatch] = useActionState(
    updateUsersSettings as any,
    initialState
  )

  useEffect(() => {
    if (state.message && state.message !== null)
      if (state.success) toast.success(state.message)
      else toast.error(state.message)
  }, [state])
  if (!canModerate) return <AccessDenied />

  const allRoles: Role[] = roleCtrl.getRoles()
  const roleOptions: Option[] = allRoles.map((role) => ({
    label: role.title,
    value: role.slug,
  }))

  console.log('#234987 state: ', state.values?.defaultRoles)
  const userRoles: Option[] = Array.isArray(state.values?.defaultRoles)
    ? state.values?.defaultRoles.map((slug: string) => {
        const findedRole: Role | undefined = allRoles.find(
          (role: Role) => role.slug == slug
        )
        return { label: findedRole?.title, value: slug }
      })
    : []
  console.log('#234987 userRoles: ', userRoles)

  return (
    <>
      <div className=" p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          {/* <Heading title={title} description={description} /> */}
        </div>
        {/* <Separator /> */}
        <form action={dispatch} ref={formRef} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
            {/* Roles */}
            <MultipleSelect
              title="نقش پیش فرض کاربر"
              name="defaultRoles"
              defaultValues={userRoles}
              placeholder="نقش پیش فرض را انتخاب کنید"
              state={state}
              defaultSuggestions={roleOptions}
              icon={<ShieldQuestionIcon className="w-4 h-4" />}
              className="col-span-3 lg:col-span-1"
            />
          </div>
          <SubmitButton />
        </form>
      </div>
    </>
  )
}

export function DeleteSettings(id: string) {}
