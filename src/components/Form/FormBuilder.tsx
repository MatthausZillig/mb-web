import React from 'react'
import { FieldValues } from 'react-hook-form'
import { useStepForm } from '../../store/FormContext'
import Form from './Form'
import { StepId } from '../../utils/validationSchema'
import { FormBuilderProps, UserType } from '../../../types/step-form'

function FormBuilder<TFieldValues extends FieldValues>({
  onSubmit,
}: Readonly<FormBuilderProps<TFieldValues>>): React.ReactElement {
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

  const handleFormSubmit = (values: TFieldValues) => {
    updateFormData(values)
    if (isLastStep()) {
      onSubmit(values)
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
        onBack={!isFirstStep() ? previousStep : undefined}
        onUserTypeChange={(type: string) => setUserType(type as UserType)}
      />
    </>
  )
}
export default FormBuilder
