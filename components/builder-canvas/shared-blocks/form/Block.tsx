// کامپوننت نمایشی بلاک
import React from 'react'
import { Block } from '../../../builder-canvas/types'
import Form from './Form'
import { getForms } from '@/lib/features/form/actions'
import RendererRows from '../../../builder-canvas/pageRenderer/RenderRows'
import { FormTranslationSchema } from '@/lib/features/form/interface'
import getTranslation from '@/lib/utils/getTranslation'

type FormBlockProps = {
  locale: string
  widgetName: string
  blockData: {
    content: { formId: string }
    type: 'form'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default async function FormBlock({
  locale,
  widgetName,
  blockData,
  ...props
}: FormBlockProps) {
  const { content } = blockData

  const result = await getForms({
    filters: { id: content.formId },
  })

  const form = result.data?.[0] ?? null

  const translation: FormTranslationSchema = getTranslation({
    translations: form?.translations,
    locale,
  })

  const formContent = (
    <RendererRows
      rows={translation?.content?.rows}
      editroMode={false}
      {...props}
    />
  )

  // فقط داده‌ی ساده به Form پاس بده
  return form ? (
    <Form
      form={form}
      {...props}
      blockData={blockData}
      widgetName={widgetName}
      formContent={formContent}
    />
  ) : null
}
