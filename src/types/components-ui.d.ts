import { ReactNode } from 'react'

export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
  fullWidth?: boolean
  children: ReactNode
  isLoading?: boolean
}
