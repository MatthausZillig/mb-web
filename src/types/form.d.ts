import { FieldValues } from 'react-hook-form'

export interface StepFormItemProps {
  id: string
  fields: Array<{
    name: string
    label: string
    type: string
    required: boolean
    options?: Array<{ value: string; label: string }>
  }>
}

export interface StepFormProps {
  steps: StepFormItemProps[]
  defaultValues: Record<string, any>
  onSubmit(values: Record<string, any>): void
}

export interface FormField {
  name: string
  type?: string
  label?: string
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
}

export interface FormProps<TFieldValues extends FieldValues> {
  fields: FormField[]
  formData: Partial<TFieldValues>
  hasError: boolean
  showBackButton?: boolean
  stepId: StepId
  isLastStep: boolean
  isSubmitting: boolean
  onSubmit: (values: TFieldValues) => void
  onBack?: () => void
  onUserTypeChange?: (type: string) => void
}

export interface FormData {
  [key: string]: any
}

export type UserType = 'CPF' | 'CNPJ'

export interface StepFormContextType {
  steps: StepFormItemProps[]
  currentStepIndex: number
  userType: UserType | null
  formData: FormData
  setUserType: (type: UserType) => void
  nextStep: () => void
  previousStep: () => void
  isLastStep: () => boolean
  isFirstStep: () => boolean
  getCurrentStep: () => StepFormItemProps
  updateFormData: (data: Partial<FormData>) => void
  getFieldsForStep: (stepIndex: number) => FormField[]
}

export interface FormBuilderProps<TFieldValues extends FieldValues> {
  onSubmit: (values: TFieldValues) => void
}

interface Option {
  value: string
  label: string
}

interface UserTypeSelectionProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  label: string
  options: Option[]
  required?: boolean
  onUserTypeChange?: (value: string) => void
}

interface TextFieldProps {
  name: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
}

interface Option {
  value: string
  label: string
}

interface UserTypeSelectionProps {
  name: string
  label: string
  options: Option[]
  onUserTypeChange?: (value: string) => void
}
