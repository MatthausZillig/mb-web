import { lazy, Suspense } from 'react'
import { useStepForm } from '../store/FormContext'
import { RegistrationHeading } from '../components/ui/RegistrationHeading'
import { StepTitle, StepTitleCNPJ } from '../constants/forms'
import { StepFormItemProps } from '../types/form'

const LazyFormBuilder = lazy(() => import('../components/Form/StepFormCreator'))

function RoutePage() {
  const { currentStepIndex, getCurrentStep, userType } = useStepForm()

  const getTitle = (userType: string, step: StepFormItemProps) => {
    if (userType === 'CNPJ' && step.id === 'STEP_2') {
      return StepTitleCNPJ[step.id as keyof typeof StepTitleCNPJ]
    }
    return StepTitle[step.id as keyof typeof StepTitle]
  }
  const currentStep = getCurrentStep()
  const parsedTitle = currentStep ? getTitle(userType || '', currentStep) : ''
  return (
    <Suspense fallback={<div>...loading</div>}>
      <RegistrationHeading title={parsedTitle} step={currentStepIndex + 1} />
      <LazyFormBuilder />
    </Suspense>
  )
}
export default RoutePage
