import { useStepForm } from '../store/FormContext'
import FormBuilder from '../components/Form/FormBuilder'
import { RegistrationHeading } from '../components/ui/RegistrationHeading'
import { registrationPost } from '../services/registration.post'

function RoutePage() {
  const { formData, currentStepIndex } = useStepForm()

  console.log('currentStepIndex', currentStepIndex)

  return (
    <div>
      <RegistrationHeading title="Cadastro" step={currentStepIndex + 1} />
      <FormBuilder
        onSubmit={() => {
          registrationPost(formData)
        }}
      />
    </div>
  )
}

export default RoutePage
