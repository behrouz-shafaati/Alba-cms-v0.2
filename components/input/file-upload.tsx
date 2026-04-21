'use client'

import Image from 'next/image'
import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  Ref,
  useMemo,
  useCallback,
} from 'react'
import { useDropzone } from 'react-dropzone'
import { X as XMarkIcon, CloudUpload as ArrowUpTrayIcon } from 'lucide-react'
import Modal from '../other/modal/modal'
import Text from './text'
import { Button } from '../ui/button'
import Checkbox from './checkbox'
import clsx from 'clsx'
import {
  deleteFile,
  updateFileDetailsAction,
  uploadFile,
} from '@/lib/features/file/actions'
import {
  File as BeFile,
  FileDetails,
  FileDetailsPayload,
} from '@/lib/features/file/interface'
import Select from './select'
import { useLocale } from '@/hooks/useLocale'
import { toast } from 'sonner'
import getTranslation from '@/lib/utils/getTranslation'
const ObjectId = require('bson-objectid')

// Type تعریف برای رفرنس
export interface FileUploadRef {
  removeFileById: (index: string) => void
  removeFile: (index: number) => void
  removeAll: () => void
  getFiles: () => any[]
  clearFiles: () => void
}

export type AllowedFileCategory =
  | 'image'
  | 'image_svg'
  | 'video'
  | 'audio'
  | 'pdf'
  | 'document'
  | 'zip'
  | 'text'

// Type تعریف برای Props
interface FileUploadProps {
  className?: string
  title: string
  name: string
  defaultValues?: BeFile[]
  state?: any
  maxFiles?: number
  allowedFileTypes?: AllowedFileCategory[]
  showDeleteButton?: boolean
  responseHnadler?: (FileDetails: FileDetails) => void
  updateFileDetailsHandler?: (FileDetails: FileDetails[]) => void
  deleteFileHnadler?: (fileId: string) => void
  onChange?: (fileDetails: FileDetails) => void
  onLoading?: (loading: boolean) => void
  attachedTo?: { feature: string; id: string }[]
}

const FileUpload = forwardRef<FileUploadRef, FileUploadProps>(
  function FileUpload(
    {
      className,
      title,
      name,
      defaultValues,
      state,
      maxFiles,
      allowedFileTypes = [],
      showDeleteButton = true,
      responseHnadler,
      updateFileDetailsHandler,
      deleteFileHnadler,
      onChange,
      attachedTo,
      onLoading,
    },
    ref: Ref<FileUploadRef>,
  ) {
    const t = useLocale()
    const locale = 'fa'
    const errorMessages: string[] = state?.errors?.[name] ?? []
    const hasError = errorMessages.length > 0

    //  defaultValues را نرمال می‌کنیم (بدون mutate کردن props)
    const normalizedDefaultValues = useMemo<BeFile[]>(() => {
      if (!defaultValues) return []
      return Array.isArray(defaultValues) ? defaultValues : [defaultValues]
    }, [defaultValues])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [files, setFiles] = useState<any[]>(normalizedDefaultValues)
    const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0)

    const accept = buildAccept(allowedFileTypes)

    const onCloseModal = () => {
      setIsModalOpen(false)
    }

    const submitFile = useCallback(
      async (file: any) => {
        try {
          onLoading?.(true)

          const formData = new FormData()
          formData.append('file', file)
          formData.append('id', file?.id)
          formData.append('title', file?.title ?? '')
          formData.append('alt', file?.alt ?? '')
          formData.append('href', file?.href ?? '')
          formData.append('target', file?.target ?? '')
          formData.append('description', file?.description ?? '')
          formData.append('main', String(!!file?.main))
          formData.append('lang', file?.lang ?? locale)
          formData.append(
            'attachedTo',
            JSON.stringify(file?.attachedTo ?? attachedTo ?? []),
          )
          formData.append('locale', locale)

          const fileDetails: FileDetails = await uploadFile(formData)
          responseHnadler?.(fileDetails)

          requestAnimationFrame(() => {
            onChange?.(fileDetails)
          })
        } catch (e) {
          console.error('upload error:', e)
          toast.error(t.feature.file.error.upload)
        } finally {
          onLoading?.(false)
        }
      },
      [attachedTo, locale, onChange, onLoading, responseHnadler, toast],
    )

    const onDrop = useCallback(
      (accepted: any[]) => {
        if (!accepted?.length) return

        if (maxFiles) {
          if ((files?.length ?? 0) + (accepted?.length ?? 0) > maxFiles) {
            toast.error(
              t.feature.file.error.maxCount.replace('%s%', String(maxFiles)),
            )
            return
          }
        }

        let firstImage = true
        const newFiles = accepted.map((file) =>
          Object.assign(file, {
            id: ObjectId().toString(),
            preview: URL.createObjectURL(file),
            main: (() => {
              if (files.length === 0 && firstImage) {
                firstImage = false
                return true
              }
              return false
            })(),
            lang: locale,
            title: file.name.split('.')[0],
            alt: '',
            href: '',
            description: '',
            attachedTo,
            locale,
          }),
        )

        setFiles((previousFiles) => [...previousFiles, ...newFiles])

        for (const file of newFiles) {
          void submitFile(file)
        }
      },
      [attachedTo, files.length, locale, maxFiles, submitFile, toast],
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept,
      multiple: true,
      maxSize: 6 * 1024 * 1024, // 6 MB (درست‌تر)
      onDrop,
    })

    // 🔹 آپدیت جزئیات فایل‌ها وقتی files عوض می‌شود
    useEffect(() => {
      const handelUpdateFileDetails = async (
        filesDetails: FileDetailsPayload[],
      ) => {
        if (!filesDetails.length) return
        const updatedFilesArray = await updateFileDetailsAction(filesDetails)
        updateFileDetailsHandler?.(updatedFilesArray)
      }

      if (!files.length) return

      const filesDetails: FileDetailsPayload[] = files
        .filter((file) => file?.id)
        .map((file) => {
          const translation = getTranslation({
            translations: file?.translations,
            locale,
          })
          const newFile: FileDetailsPayload = {
            id: file.id,
            title: translation?.title ?? '',
            alt: translation?.alt ?? '',
            href: file.href ?? '',
            target: file.target ?? '',
            description: translation?.description ?? '',
            main: !!file.main,
            lang: locale,
            attachedTo,
            locale,
          }
          return newFile
        })

      // این قمست برای جلوگیری از افتادن در یک حلقه بی نهایت از  بازرندر کامپوننتها ضروری است
      const flgFilesIsDefferentWithDefaultValues = areFilesDifferent(
        files,
        normalizedDefaultValues,
      )
      if (flgFilesIsDefferentWithDefaultValues) {
        console.log('#88823 files are different, updating file details...')
        void handelUpdateFileDetails(filesDetails)
      }
    }, [files, attachedTo, locale])
    // }, [files, attachedTo, locale, updateFileDetailsHandler])

    const removeFile = useCallback(
      async (index: number) => {
        onLoading?.(true)
        const items = [...files]
        const [deletedItem] = items.splice(index, 1)

        if (deletedItem?.main && items.length) {
          items[0].main = true
        }

        setFiles(items)

        try {
          if (deletedItem?.id) {
            await deleteFile(deletedItem.id)
          }
          requestAnimationFrame(() => {
            onChange?.(items)
            deleteFileHnadler?.(deletedItem?.id)
          })
        } catch (e) {
          console.error('delete error:', e)
          toast.error(t.feature.file.error.delete)
        } finally {
          onLoading?.(false)
        }
      },
      [deleteFileHnadler, files, onChange, onLoading, toast],
    )

    const removeFileById = useCallback(
      (id: string) => {
        console.log('#deleteFileById id:', id)
        const items = [...files]
        for (let index = 0; index < items.length; index++) {
          if (String(items[index].id) === id) {
            void removeFile(index)
            return
          }
        }
      },
      [files, removeFile],
    )

    const removeAll = useCallback(() => {
      setFiles([])
      requestAnimationFrame(() => {
        onChange?.([])
      })
    }, [onChange])

    const unCheckMainAllFiles = useCallback(() => {
      setFiles((previousFiles) => {
        const newFiles = previousFiles.map((file) => ({
          ...file,
          main: false,
        }))
        return newFiles
      })
    }, [])

    const handleCheckMainFile = (e: any, index: number) => {
      if (!e.target.checked) return

      unCheckMainAllFiles()
      setFiles((previousFiles) => {
        const newFiles = [...previousFiles]
        if (newFiles[index]) {
          newFiles[index] = { ...newFiles[index], main: true }
        }
        return newFiles
      })
    }

    const onSaveFileDetails = (newFile: any, index: number) => {
      setIsModalOpen(false)

      if (newFile.main) {
        unCheckMainAllFiles()
      } else if (files.length === 1) {
        newFile.main = true
      }

      setFiles((previousFiles) => {
        const newFiles = [...previousFiles]
        newFiles[index] = newFile
        return newFiles
      })
    }

    useImperativeHandle(
      ref,
      () => ({
        removeFileById,
        removeFile: (index: number) => {
          void removeFile(index)
        },
        removeAll,
        getFiles: () => files,
        clearFiles: () => setFiles([]),
      }),
      [files, removeAll, removeFile, removeFileById],
    )

    const makeIdsClean = () => {
      if (maxFiles === 1) return files.length === 1 ? files[0]?.id : ''
      return JSON.stringify(files.filter((file) => file).map((file) => file.id))
    }

    return (
      <>
        <div>
          <p className="my-2 text-md">{title}</p>

          <textarea name={name} value={makeIdsClean()} readOnly hidden />

          <div
            {...getRootProps({
              className: `${
                className ?? ''
              } border-2 border-dashed border-secondary-400 p-4 text-center rounded-md text-gry-400`,
            })}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-2 text-xs text-gray-400">
              <ArrowUpTrayIcon className="w-5 h-5 fill-current" />
              {isDragActive ? (
                <p>{t.feature.file.dropHere}</p>
              ) : (
                <p>{t.feature.file.dropHereOrClick}</p>
              )}
            </div>
          </div>

          <section>
            <ul className="grid grid-cols-3 gap-2 mt-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {files.map((file, index) => (
                <li
                  key={file?.id ?? index}
                  className="relative rounded-md max-h-20 h-22 group min-h-12"
                >
                  {(file?.srcSmall || file?.preview) && (
                    <Image
                      src={file?.preview || file?.srcSmall}
                      alt={file?.title || file?.alt || ''}
                      width={100}
                      height={100}
                      className={clsx(
                        'h-full w-full cursor-pointer rounded-md object-contain shadow-sm',
                        { 'border-2 border-blue-500': file?.main },
                      )}
                      onClick={() => {
                        setSelectedFileIndex(index)
                        setIsModalOpen(true)
                      }}
                    />
                  )}
                  {showDeleteButton && (
                    <button
                      type="button"
                      className="absolute flex items-center justify-center w-5 h-5 text-white transition-colors bg-gray-400 border rounded-full border-secondary-400 bg-secondary-400 -right-1 -top-1 hover:bg-red-500 hover:text-white"
                      onClick={() => void removeFile(index)}
                    >
                      <XMarkIcon className="w-5 h-5 transition-colors hover:fill-secondary-400" />
                    </button>
                  )}
                  <label className="absolute bottom-0 hidden w-full p-1 text-xs bg-white cursor-pointer group-hover:block">
                    <input
                      name="main"
                      type="checkbox"
                      className="mr-1"
                      checked={!!file?.main}
                      onChange={(e) => handleCheckMainFile(e, index)}
                    />
                    <span className="mr-2">{t.feature.file.featured}</span>
                  </label>
                </li>
              ))}
            </ul>
          </section>

          {hasError && (
            <div id={`${name}-error`} aria-live="polite" aria-atomic="true">
              {errorMessages.map((error) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          )}
        </div>

        <Modal
          isOpen={isModalOpen}
          content={
            <ModalContent
              file={files[selectedFileIndex]}
              index={selectedFileIndex}
              onCloseModal={onCloseModal}
              onSave={onSaveFileDetails}
            />
          }
          title={t.feature.file.fileDetailsForm.title}
          onCloseModal={onCloseModal}
        />
      </>
    )
  },
)

const ModalContent = ({
  file,
  index,
  onCloseModal,
  onSave,
}: {
  file: any
  index: number
  onCloseModal: () => void
  onSave: (newFile: any, index: number) => void
}) => {
  const locale = 'fa'
  const t = useLocale()
  const translation = getTranslation({
    translations: file?.translations,
    locale,
  })

  const [newFile, setNewFile] = useState({
    ...file,
    lang: locale,
  })

  const handleUpdate = (key: string, value: any) => {
    setNewFile((s: any) => ({
      ...s,
      translations: (s.translations ?? [{ lang: locale }]).map((t: any) =>
        t.lang === locale ? { ...t, [key]: value } : t,
      ),
    }))
  }

  return (
    <div className="mt-4">
      <div className="relative h-24">
        <Image
          src={file?.preview || file?.srcSmall}
          alt={file?.name || 'uploaded image'}
          width={100}
          height={100}
          className="object-contain w-full h-full rounded-md"
        />
      </div>

      <div className="mt-4">
        <input type="text" name="lang" className="hidden" value="fa" readOnly />

        <Text
          title={t.feature.file.fileDetailsForm.title}
          name="title"
          defaultValue={translation?.title}
          onChange={(e) => handleUpdate('title', e.target.value)}
        />
        <Text
          title={t.feature.file.fileDetailsForm.alt}
          name="alt"
          defaultValue={translation?.alt}
          onChange={(e) => handleUpdate('alt', e.target.value)}
        />
        <Text
          title={t.feature.file.fileDetailsForm.description}
          name="description"
          defaultValue={translation?.description}
          onChange={(e) => handleUpdate('description', e.target.value)}
        />

        <Text
          title={t.feature.file.fileDetailsForm.href}
          name="href"
          defaultValue={newFile.href}
          onChange={(e) =>
            setNewFile((s: any) => ({ ...s, href: e.target.value }))
          }
        />

        <Select
          title={t.feature.file.fileDetailsForm.target}
          name="target"
          options={[
            {
              value: '_self',
              label: t.feature.file.fileDetailsForm.targetSelf,
            },
            {
              value: '_blank',
              label: t.feature.file.fileDetailsForm.targetBlamk,
            },
          ]}
          defaultValue={newFile?.target}
          onChange={(value) =>
            setNewFile((s: any) => ({ ...s, target: value }))
          }
        />

        <Checkbox
          name="main"
          disabled={file.main}
          title={t.feature.file.featured}
          checked={!!newFile.main}
          onChange={(e: any) =>
            setNewFile((s: any) => ({
              ...s,
              main: e.target?.checked || false,
            }))
          }
        />
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button
          onClick={onCloseModal}
          className="flex items-center h-10 px-4 text-sm font-medium text-gray-600 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          {t.feature.file.fileDetailsForm.cancel}
        </Button>
        <Button type="button" onClick={() => onSave(newFile, index)}>
          {t.feature.file.fileDetailsForm.save}
        </Button>
      </div>
    </div>
  )
}

export default FileUpload

const FILE_ACCEPT_MAP: Record<AllowedFileCategory, Record<string, string[]>> = {
  image: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
  image_svg: { 'image/svg+xml': ['.svg'] },
  video: { 'video/*': ['.mp4', '.mov', '.avi', '.mkv'] },
  audio: { 'audio/*': ['.mp3', '.wav', '.ogg'] },
  pdf: { 'application/pdf': ['.pdf'] },
  document: {
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
      '.docx',
    ],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
      '.xlsx',
    ],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      ['.pptx'],
    'text/plain': ['.txt'],
  },
  zip: {
    'application/zip': ['.zip'],
    'application/x-rar-compressed': ['.rar'],
  },
  text: { 'text/plain': ['.txt'] },
}

function buildAccept(allowedTypes?: AllowedFileCategory[]) {
  if (!allowedTypes || allowedTypes.length === 0) return undefined

  return allowedTypes?.reduce(
    (acc, type) => {
      const mapping = FILE_ACCEPT_MAP[type]
      if (mapping) Object.assign(acc, mapping)
      return acc
    },
    {} as Record<string, string[]>,
  )
}

/* ======================================== */
/**
 * بررسی می‌کند که آیا دو آرایه فایل با هم تفاوت دارند یا خیر
 * فقط فیلد "updatedAt" نادیده گرفته می‌شود
 *
 * @param currentFiles آرایه فایل‌های فعلی
 * @param defaultFiles آرایه فایل‌های پیش‌فرض
 * @returns true اگر تفاوتی وجود داشته باشد، false اگر کاملاً برابر باشند (به جز updatedAt)
 */
export function areFilesDifferent(
  currentFiles: any[] = [],
  defaultFiles: any[] = [],
): boolean {
  // اگر تعداد فایل‌ها متفاوت بود، حتماً فرق دارند
  if (currentFiles.length !== defaultFiles.length) return true

  for (let i = 0; i < currentFiles.length; i++) {
    if (!areObjectsEqualIgnoringUpdatedAt(currentFiles[i], defaultFiles[i])) {
      return true
    }
  }

  return false
}

/**
 * مقایسه دو مقدار (primitive, object, array) به صورت بازگشتی
 * فقط فیلد "updatedAt" نادیده گرفته می‌شود
 *
 * @param objA مقدار اول
 * @param objB مقدار دوم
 * @returns true اگر برابر باشند (به جز updatedAt)، false اگر متفاوت باشند
 */
function areObjectsEqualIgnoringUpdatedAt(objA: any, objB: any): boolean {
  // اگر کاملاً برابر بودند
  if (objA === objB) {
    return true
  }

  // اگر یکی null یا undefined باشد یا نوع‌ها متفاوت باشند
  if (objA == null || objB == null || typeof objA !== typeof objB) {
    // console.log('#88823 not equal objA or objB is null:', objA, objB)
    return false
  }

  // اگر آرایه بودن بره بازگشتی اینا رو هم حساب کنه
  if (Array.isArray(objA) && Array.isArray(objB)) {
    if (objA.length !== objB.length) {
      // console.log('#888a23aa different array lengths:', objA, objB)
      return false
    }
    for (let i = 0; i < objA.length; i++) {
      if (!areObjectsEqualIgnoringUpdatedAt(objA[i], objB[i])) {
        // console.log('#8882aaa3 array items not equal:', objA[i], objB[i])
        return false
      }
    }
    return true
  }

  // آبجکت
  if (typeof objA === 'object') {
    const keysA = Object.keys(objA).filter(
      (key) => key !== 'updatedAt' && key !== 'lang',
    )
    const keysB = Object.keys(objB).filter(
      (key) => key !== 'updatedAt' && key !== 'lang',
    )

    if (keysA.length !== keysB.length) {
      // console.log('#888a23 different number of keys:', objA, objB)
      // console.log(`#888a23 keysA: ${keysA.length}  | keysB: ${keysB.length}`)
      // console.log('#888a23 objA:', objA)
      // console.log('#888a23 objB:', objB)
      return false
    }

    for (const key of keysA) {
      if (!keysB.includes(key)) {
        // console.log('#88s823 key not found in keysB:', key, objA, objB)
        return false
      }
      if (!areObjectsEqualIgnoringUpdatedAt(objA[key], objB[key])) {
        // console.log(
        //   '#88d823 values for key not equal:',
        //   key,
        //   objA[key],
        //   objB[key]
        // )
        return false
      }
    }

    return true
  }

  // primitive
  // console.log('#88823 last compare:', objA === objB)
  return objA === objB
}
