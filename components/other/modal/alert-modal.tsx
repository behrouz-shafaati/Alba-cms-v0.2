'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Modal from './modal'
import { useLocale } from '@/hooks/useLocale'

interface AlertModalProps {
  title?: any
  description?: any
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
}

export const AlertModal: React.FC<AlertModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const dictionary = useLocale()
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const ModalContent = () => (
    <div className="pt-6 space-x-2 flex items-center justify-end w-full">
      <Button disabled={loading} variant="outline" onClick={onClose}>
        {dictionary.shared.cancel}
      </Button>
      <Button disabled={loading} variant="destructive" onClick={onConfirm}>
        {dictionary.shared.continue}
      </Button>
    </div>
  )
  return (
    <Modal
      title={title ? title : dictionary.shared.warning}
      description={description ? description : 'این عمل غیر قابل بازگشت است'}
      isOpen={isOpen}
      onCloseModal={onClose}
      content={<ModalContent />}
    />
  )
}
