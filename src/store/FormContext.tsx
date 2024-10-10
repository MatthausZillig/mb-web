import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from 'react'

import { StepFormContextType, StepFormItemProps, UserType, FormField } from '../../types/step-form'



const StepFormContext = createContext<StepFormContextType | undefined>(
  undefined
)

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>({} as FormData)
  const updateFormData = useCallback((data: Partial<FormData>) => {
    setFormData((prevData) => ({ ...prevData, ...data }))
  }, [])

  const initialSteps: StepFormItemProps[] = useMemo(
    () => [
      {
        id: 'STEP_1',
        fields: [
          {
            name: 'EMAIL',
            label: 'Endereço de e-mail',
            type: 'text',
            required: true,
          },
          {
            name: 'userType',
            type: 'userTypeSelection',
            label: 'Tipo de Usuário',
            required: true,
            options: [
              { value: 'CPF', label: 'Pessoa Física' },
              { value: 'CNPJ', label: 'Pessoa Jurídica' },
            ],
          },
        ],
      },
      {
        id: 'STEP_2',
        fields: [
          { name: 'NAME', label: 'Nome', type: 'text', required: true },
          { name: 'DOCUMENT', label: 'CPF', type: 'text', required: true },
          {
            name: 'BIRTH',
            label: 'Data de nascimento',
            type: 'text',
            required: true,
          },
          { name: 'PHONE', label: 'Telefone', type: 'text', required: true },
        ],
      },
      {
        id: 'STEP_3',
        fields: [
          {
            name: 'PASSWORD',
            label: 'Sua senha',
            type: 'password',
            required: true,
          },
        ],
      },
    ],
    []
  )

  const [steps, setSteps] = useState(initialSteps)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [userType, setUserType] = useState<UserType | null>(null)

  const getFieldsForStep = useCallback(
    (stepIndex: number): FormField[] => {
      return steps[stepIndex]?.fields || []
    },
    [steps]
  )

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prevIndex) =>
      prevIndex < steps.length - 1 ? prevIndex + 1 : prevIndex
    )
  }, [steps.length])

  const previousStep = useCallback(() => {
    setCurrentStepIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    )
  }, [])

  const isLastStep = useCallback(
    () => currentStepIndex === steps.length - 1,
    [currentStepIndex, steps.length]
  )
  const isFirstStep = useCallback(
    () => currentStepIndex === 0,
    [currentStepIndex]
  )
  const getCurrentStep = useCallback(
    () => steps[currentStepIndex],
    [steps, currentStepIndex]
  )

  useEffect(() => {
    if (userType) {
      const updatedSteps = [...initialSteps]
      updatedSteps[1] = {
        ...updatedSteps[1],
        fields:
          userType === 'CPF'
            ? [
                { name: 'NAME', label: 'Nome', type: 'text', required: true },
                {
                  name: 'DOCUMENT',
                  label: 'CPF',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'BIRTH',
                  label: 'Data de nascimento',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'PHONE',
                  label: 'Telefone',
                  type: 'text',
                  required: true,
                },
              ]
            : [
                { name: 'NAME', label: 'Nome', type: 'text', required: true },
                { name: 'DOCUMENT', label: 'CNPJ', type: 'text', required: true },
                {
                  name: 'BIRTH',
                  label: 'Data de abertura',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'PHONE',
                  label: 'Telefone',
                  type: 'text',
                  required: true,
                },
              ],
      }

      const reviewFields = updatedSteps.flatMap((step) =>
        step.fields.filter((field) => field.type !== 'userTypeSelection')
      )

      const reviewStep: StepFormItemProps = {
        id: 'STEP_4',
        fields: reviewFields,
      }
      setSteps([...updatedSteps, reviewStep])
    }
  }, [userType, initialSteps])

  const contextValue = useMemo(
    () => ({
      steps,
      currentStepIndex,
      formData,
      userType,
      setUserType,
      nextStep,
      previousStep,
      isLastStep,
      isFirstStep,
      getCurrentStep,
      updateFormData,
      getFieldsForStep,
    }),
    [
      steps,
      currentStepIndex,
      formData,
      userType,
      nextStep,
      previousStep,
      isLastStep,
      isFirstStep,
      getCurrentStep,
      updateFormData,
      getFieldsForStep,
    ]
  )

  return (
    <StepFormContext.Provider value={contextValue}>
      {children}
    </StepFormContext.Provider>
  )
}
export function useStepForm() {
  const context = useContext(StepFormContext)
  if (context === undefined) {
    throw new Error('useStepForm must be used within a FormProvider')
  }
  return context
}
