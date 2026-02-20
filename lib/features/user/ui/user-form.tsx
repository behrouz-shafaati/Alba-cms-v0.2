'use client'
import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  User as UserIcon,
  Mail as MailIcon,
  Smartphone as PhoneIcon,
  ShieldQuestionIcon,
  KeyRound,
  Trash,
} from 'lucide-react'
import { Heading } from '@/components/other/ui/heading'
import roleCtrl from '@/lib/features/role/controller'
import {
  createUserAction,
  deleteUsersAction,
  updateUser,
} from '@/lib/features/user/actions'
import Text from '@/components/input/text'
import SubmitButton from '@/components/input/submit-button'
import { AlertModal } from '@/components/other/modal/alert-modal'
import { Role } from '@/lib/features/role/interface'
import AccessDenied from '@/components/other/access-denied'
import StickyBox from 'react-sticky-box'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import authorize from '@/lib/utils/authorize'
import getTranslation from '@/lib/utils/getTranslation'
import { toast } from 'sonner'
import { Option } from '@/lib/types'
import MultipleSelect from '@/components/input/multiple-select'
import ProfileUpload from '@/components/input/profile-upload'

interface ProductFormProps {
  initialData: any | null
  lodginedUser: User | null
}

export const UserForm: React.FC<ProductFormProps> = ({
  initialData: user,
  lodginedUser,
}) => {
  const META_DESC_LIMIT = 300
  const router = useRouter()
  const lodginedUserRoles = lodginedUser?.roles || []

  const canCreate = authorize(lodginedUserRoles, 'user.create')
  const canEdit = authorize(
    lodginedUserRoles,
    lodginedUser?.id !== user?.id ? 'user.edit.any' : 'user.edit.own',
  )
  const canDelete = authorize(
    lodginedUserRoles,
    lodginedUser?.id !== user?.id ? 'user.delete.any' : 'user.delete.own',
  )

  const initialState = {
    message: null,
    errors: {},
    values: { roles: [], ...user },
  }
  const actionHandler = user
    ? updateUser.bind(null, String(user.id))
    : createUserAction
  const [state, dispatch] = useActionState(actionHandler as any, initialState)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)

  const translation = getTranslation({ translations: user?.translations || [] })
  const [about, setAbout] = useState(translation?.about || '')
  useEffect(() => {
    if (state.message && state.message !== null)
      if (state.success) toast.success(state.message)
      else toast.error(state.message)
  }, [state, toast])
  if ((user && !canEdit) || !canCreate) return <AccessDenied />
  const allRoles: Role[] = roleCtrl.getRoles()
  const roleOptions: Option[] = allRoles.map((role) => ({
    label: role.title,
    value: role.slug,
  }))
  const userRoles: Option[] = Array.isArray(state.values?.roles)
    ? state.values?.roles.map((slug: string) => {
        const findedRole: Role | undefined = allRoles.find(
          (role: Role) => role.slug == slug,
        )
        return { label: findedRole?.title, value: slug }
      })
    : []

  const title = user ? 'ویرایش کاربر' : 'افزودن کاربر'
  const description = user ? user.name : 'افزودن یک کاربر'
  const toastMessage = user ? 'کاربر بروزرسانی شد' : 'کاربر اضافه شد'
  const action = user ? 'ذخیره تغییرات' : 'ذخیره'

  const onDelete = async () => {
    try {
      setLoading(true)
      const deleteResult = await deleteUsersAction([user?.id])
      if (deleteResult?.success) router.replace('/dashboard/users')
      else {
        setOpen(false)
        setLoading(false)
        if (deleteResult.success) toast.success(deleteResult.message)
        else toast.error(deleteResult.message)
      }
    } catch (error: any) {}
  }

  return (
    <>
      {' '}
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {canDelete && (
          <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
          />
        )}

        {user && canDelete && (
          <>
            <AlertModal
              isOpen={open}
              onClose={() => setOpen(false)}
              onConfirm={onDelete}
              loading={loading}
            />
            <Button
              disabled={loading}
              variant="destructive"
              size="sm"
              onClick={() => setOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      {/* <Separator /> */}
      <form action={dispatch} className="grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-9 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <input type="hidden" name="locale" value="fa" />
          {/* First Name */}
          <Text
            title="نام"
            name="firstName"
            defaultValue={state.values?.firstName || ''}
            placeholder="نام"
            state={state}
            icon={<UserIcon className="w-4 h-4" />}
            className="col-span-3 lg:col-span-1"
          />
          {/* Last Name */}
          <Text
            title="نام خانوادگی"
            name="lastName"
            defaultValue={state.values?.lastName}
            placeholder="نام خانوادگی"
            state={state}
            icon={<UserIcon className="w-4 h-4" />}
            className="col-span-3 lg:col-span-1"
          />
          {/* Email */}
          <Text
            title="ایمیل"
            name="email"
            defaultValue={state.values?.email}
            placeholder="ایمیل"
            state={state}
            icon={<MailIcon className="w-4 h-4" />}
            className="col-span-3 lg:col-span-1"
          />
          {/* userName */}
          <Text
            title="نام کاربری"
            name="userName"
            defaultValue={state.values?.userName}
            placeholder="نام کاربری"
            state={state}
            icon={<MailIcon className="w-4 h-4" />}
            className="col-span-3 lg:col-span-1"
          />
          {/* Mobile */}
          <Text
            title="موبایل"
            name="mobile"
            defaultValue={state.values?.mobile}
            placeholder="موبایل"
            state={state}
            icon={<PhoneIcon className="w-4 h-4" />}
            className="col-span-3 lg:col-span-1"
          />
          {/* Roles */}
          <MultipleSelect
            title="نقش"
            name="roles"
            defaultValues={userRoles}
            placeholder="نقش های کاربر را انتخاب کنید"
            state={state}
            defaultSuggestions={roleOptions}
            icon={<ShieldQuestionIcon className="w-4 h-4" />}
            className="col-span-3 lg:col-span-1"
          />
          {/* Password */}
          <Text
            title="رمز ورود"
            name="password"
            type="password"
            placeholder="رمز ورود"
            description={
              user &&
              'اگر می خواهید رمز ورود کاربر را تغییر دهید، این فیلد را پر کنید.'
            }
            state={state}
            icon={<KeyRound className="w-4 h-4" />}
            className="col-span-3 lg:col-span-1"
          />
          <div className="col-span-3">
            {/* Meta Description */}
            <div className="space-y-1">
              <Label htmlFor="about">معرفی</Label>
              <Textarea
                id="about"
                name="about"
                defaultValue={state.values?.about}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                maxLength={META_DESC_LIMIT}
                rows={3}
                placeholder="معرفی کوتاه کاربر..."
              />
              <p
                className={cn(
                  'text-xs text-gray-500 text-right',
                  about.length > META_DESC_LIMIT - 20 && 'text-yellow-600',
                  about.length >= META_DESC_LIMIT && 'text-red-600',
                )}
              >
                {about.length}/{META_DESC_LIMIT} کاراکتر
              </p>
            </div>
          </div>
        </div>

        <div className="relative col-span-12 md:col-span-3 gap-2">
          <StickyBox offsetBottom={0}>
            <ProfileUpload title="" name="image" defaultValue={user?.image} />
            <SubmitButton loading={loading} className="my-4 w-full" />
          </StickyBox>
        </div>
      </form>
    </>
  )
}
