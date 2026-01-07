import React from 'react'

export interface InputProps {
  placeholder: string
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  className?: string
  name?: string
  autoComplete: 'off' | 'on'
}
