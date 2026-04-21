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

type Device = 'allDevices' | 'mobile' | 'tablet' | 'desktop'

type CssEditorProps = {
  value?: {
    allDevices: string
    mobile: string
    tablet: string
    desktop: string
  }
  onChange?: (output: {
    allDevices: string
    mobile: string
    tablet: string
    desktop: string
  }) => void
  height?: string
}

export default function CssEditor({
  value = { allDevices: '', mobile: '', tablet: '', desktop: '' },
  onChange,
  height = '400px',
}: CssEditorProps) {
  const [_value, setValue] = useState(value)
  const [device, setDevice] = useState<Device>('allDevices')

  function update(css: string) {
    const next = structuredClone(
      _value || { allDevices: '', mobile: '', tablet: '', desktop: '' },
    )

    next[device] = css

    setValue(next)
    onChange(next)
  }

  return (
    <div className="rounded-md overflow-hidden border border-gray-700">
      <Tabs value={device} onValueChange={(v) => setDevice(v as Device)}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="allDevices">All</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
          <TabsTrigger value="tablet">Tablet</TabsTrigger>
          <TabsTrigger value="desktop">Desktop</TabsTrigger>
        </TabsList>
      </Tabs>
      <CodeMirror
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
