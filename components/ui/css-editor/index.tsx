// components/admin/css-editor/CssEditor.tsx
'use client'

import dynamic from 'next/dynamic'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-[#1e1e1e] text-gray-400 text-sm flex items-center justify-center">
      در حال بارگذاری...
    </div>
  ),
})

import { css } from '@codemirror/lang-css'
import { oneDark } from '@codemirror/theme-one-dark'
import { useState } from 'react'
import { useBuilderStore } from '@/components/builder-canvas/store/useBuilderStore'

type Device = 'sm' | 'md' | 'lg'

type CssEditorProps = {
  value?: {
    sm: string
    md: string
    lg: string
  }
  onChange?: (output: { sm: string; md: string; lg: string }) => void
  height?: string
}

export default function CssEditor({
  value = { sm: '', md: '', lg: '' },
  onChange,
  height = '400px',
}: CssEditorProps) {
  const [_value, setValue] = useState(value)
  const { device, setDevice } = useBuilderStore()

  function update(css: string) {
    const next = structuredClone(_value || { sm: '', md: '', lg: '' })

    next[device] = css

    setValue(next)
    onChange(next)
  }

  return (
    <div className="rounded-md overflow-hidden border border-gray-700">
      <Tabs value={device} onValueChange={(v) => setDevice(v as Device)}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="sm">Mobile</TabsTrigger>
          <TabsTrigger value="md">Tablet</TabsTrigger>
          <TabsTrigger value="lg">Desktop</TabsTrigger>
        </TabsList>
      </Tabs>
      <CodeMirror
        className="w-[273px]"
        value={_value[device]}
        height={height}
        extensions={[css()]}
        theme={oneDark}
        onChange={update}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          autocompletion: true,
        }}
      />
    </div>
  )
}
