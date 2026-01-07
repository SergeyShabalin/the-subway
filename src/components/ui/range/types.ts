import type { ChangeEvent, ReactNode } from 'react'

export interface IRangeProps {
  value: number
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  icon: ReactNode
  placeholder: string
  min: number
  max: number
  step: number
}