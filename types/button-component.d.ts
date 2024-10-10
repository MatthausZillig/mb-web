export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
  fullWidth?: boolean
  children: React.ReactNode
  isLoading?: boolean
}
