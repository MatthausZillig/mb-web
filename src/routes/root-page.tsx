import { useStepForm } from '../store/FormContext'
import { RegistrationHeading } from '../components/ui/RegistrationHeading'
import { registrationPost } from '../services/registration.post'
import { lazy, Suspense } from 'react'

const LazyFormBuilder = lazy(() => import('../components/Form/FormBuilder'))

export enum StepTitle {
  STEP_1 = 'Seja bem vindo(a)',
  STEP_2 = 'Pessoa física',
  STEP_3 = 'Senha de acesso',
  STEP_4 = 'Revise suas informações',
}

function RoutePage() {
  const { currentStepIndex, getCurrentStep } = useStepForm()

  return (
    <Suspense fallback={<div>...loading</div>}>
      <RegistrationHeading title={StepTitle[getCurrentStep().id as keyof typeof StepTitle]} step={currentStepIndex + 1} />
      <LazyFormBuilder
        onSubmit={registrationPost}
      />
    </Suspense>
  )
}
export default RoutePage
