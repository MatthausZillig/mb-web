import { lazy, Suspense } from 'react'
import { useStepForm } from '../store/FormContext'
import { RegistrationHeading } from '../components/ui/RegistrationHeading'
import { registrationPost } from '../services/registration.post'
import { StepTitle } from '../constants/forms'

const LazyFormBuilder = lazy(() => import('../components/Form/FormBuilder'))

function RoutePage() {
  const { currentStepIndex, getCurrentStep } = useStepForm()

  return (
    <Suspense fallback={<div>...loading</div>}>
      <RegistrationHeading
        title={StepTitle[getCurrentStep().id as keyof typeof StepTitle]}
        step={currentStepIndex + 1}
      />
      <LazyFormBuilder onSubmit={registrationPost} />
    </Suspense>
  )
}
export default RoutePage
