import React, { useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useStepForm } from '../../store/FormContext'
import Form from './Form'
import { UserType } from '../../../types/step-form'
import { registrationPost } from '../../services/registration.post'
import { StepId } from '../../constants/forms'

function FormBuilder<TFieldValues extends FieldValues>(): React.ReactElement {
  const {
    getCurrentStep,
    nextStep,
    previousStep,
    isLastStep,
    isFirstStep,
    setUserType,
    updateFormData,
    getFieldsForStep,
    steps,
    formData,
  } = useStepForm()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(false)

  const handleFormSubmit = async (values: TFieldValues) => {
    updateFormData(values)
    if (isLastStep()) {
      setIsSubmitting(true)
      try {
        const result = await registrationPost(values as any)
        if (result.success) {
          alert(result.message)
        } else {
          setError(true)
          alert(`Error ${result.status}: ${result.message}`)
        }
      } catch (error) {
        setError(true)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      nextStep()
    }
  }

  const currentStepIndex = steps.findIndex(
    (step) => step.id === getCurrentStep().id
  )

  const fields = getFieldsForStep(currentStepIndex)

  return (
    <>
      <Form<TFieldValues>
        fields={fields}
        formData={formData as Partial<TFieldValues>}
        showBackButton={!isFirstStep()}
        stepId={getCurrentStep().id as StepId}
        isLastStep={isLastStep()}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        hasError={error}
        onBack={!isFirstStep() ? previousStep : undefined}
        onUserTypeChange={(type: string) => setUserType(type as UserType)}
      />
    </>
  )
}
export default FormBuilder
