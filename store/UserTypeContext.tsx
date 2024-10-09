import React, { createContext, useContext, useState, ReactNode } from 'react'
import { StepFormItemProps } from '../types/step-form'

export interface FormField {
  name: string
  type?: string
  label?: string
  placeholder?: string
  required?: boolean
}

type UserType = 'CPF' | 'CNPJ'

interface StepFormContextType {
  steps: StepFormItemProps[]
  currentStepIndex: number
  userType: UserType | null
  setUserType: (type: UserType) => void
  nextStep: () => void
  previousStep: () => void
  isLastStep: () => boolean
  isFirstStep: () => boolean
  getCurrentStep: () => StepFormItemProps
}

const StepFormContext = createContext<StepFormContextType | undefined>(undefined)

export function FormWizardProvider({ children }: { children: ReactNode }) {
  const [steps, setSteps] = useState<StepFormItemProps[]>([
    { 
      id: "STEP_1", 
      fields: [
        { name: "EMAIL", label: "Endereço de e-mail", type: "text", required: true },
        { name: "DOCUMENT", label: "Pessoa física", type: "checkbox", required: true },
        { name: "CNPJ", label: "Pessoa jurídica", type: "checkbox", required: true }
      ] 
    },
    { 
      id: "STEP_2", 
      fields: [
        { name: "NAME", label: "Nome", type: "text", required: true },
        { name: "DOCUMENT", label: "CPF", type: "text", required: true },
        { name: "BIRTH", label: "Data de nascimento", type: "text", required: true },
        { name: "PHONE", label: "Telefone", type: "text", required: true },
      ] 
    },
  ])

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [userType, setUserType] = useState<UserType | null>(null)

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const isLastStep = () => currentStepIndex === steps.length - 1
  const isFirstStep = () => currentStepIndex === 0
  const getCurrentStep = () => steps[currentStepIndex]

  React.useEffect(() => {
    if (userType) {
      const updatedSteps = [...steps]
      if (userType === 'CPF') {
        updatedSteps[1] = {
          ...updatedSteps[1],
          fields: [
            { name: "NAME", label: "Nome", type: "text", required: true },
            { name: "DOCUMENT", label: "CPF", type: "text", required: true },
            { name: "BIRTH", label: "Data de nascimento", type: "text", required: true },
            { name: "PHONE", label: "Telefone", type: "text", required: true },
          ]
        }
      } else {
        updatedSteps[1] = {
          ...updatedSteps[1],
          fields: [
            { name: "NAME", label: "Nome", type: "text", required: true },
            { name: "CNPJ", label: "CPF", type: "text", required: true },
            { name: "BIRTH", label: "Data de nascimento", type: "text", required: true },
            { name: "PHONE", label: "Telefone", type: "text", required: true },
          ]
        }
      }
      setSteps(updatedSteps)
    }
  }, [userType])

  return (
    <StepFormContext.Provider 
      value={{ 
        steps, 
        currentStepIndex, 
        userType, 
        setUserType, 
        nextStep, 
        previousStep, 
        isLastStep, 
        isFirstStep, 
        getCurrentStep 
      }}
    >
      {children}
    </StepFormContext.Provider>
  )
}

export function useFormWizard() {
  const context = useContext(StepFormContext)
  if (context === undefined) {
    throw new Error('useFormWizard must be used within a FormWizardProvider')
  }
  return context
}
