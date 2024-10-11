import { useMemo, memo, ReactElement } from 'react'
import {
  FormProvider,
  useForm,
  FieldValues,
  DefaultValues,
  Resolver,
  ResolverOptions,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  getAllFieldsValidationSchema,
  validationSchema,
} from '../../utils/validationSchema'
import { FormProps, FormField } from '../../types/form'
import { Buttons, SubmittingStatus } from '../../constants/forms'
import { DateField } from './DateField'
import { UserTypeSelectionField } from './UserTypeSelectionField'
import { TextField } from './TextField'
import { Button } from '../ui/Button'

function FormComponent<TFieldValues extends FieldValues>({
  fields,
  formData,
  hasError,
  showBackButton = false,
  stepId,
  isLastStep,
  isSubmitting,
  onSubmit,
  onBack,
  onUserTypeChange,
}: Readonly<FormProps<TFieldValues>>): ReactElement {
  const schema = useMemo(
    () =>
      isLastStep
        ? getAllFieldsValidationSchema()
        : yup
            .object()
            .shape(validationSchema[stepId as keyof typeof validationSchema]),
    [isLastStep, stepId]
  )

  const customResolver: Resolver<TFieldValues> = useMemo(
    () => async (values, context, options) => {
      const yupResult = await yupResolver(schema)(
        values,
        context,
        options as ResolverOptions<FieldValues>
      )
      return {
        values: yupResult.values as TFieldValues,
        errors: yupResult.errors,
      }
    },
    [schema]
  )

  const formMethods = useForm<TFieldValues>({
    defaultValues: formData as DefaultValues<TFieldValues>,
    resolver: customResolver,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = formMethods

  const renderField = useMemo(
    () => (field: FormField) => {
      switch (field.type) {
        case 'userTypeSelection':
          return (
            <UserTypeSelectionField
              key={field.name}
              name={field.name}
              label={field.label || ''}
              options={field.options || []}
              onUserTypeChange={onUserTypeChange}
            />
          )
        case 'date':
          return <DateField key={field.name} field={field} errors={errors} />
        default:
          return (
            <TextField
              key={field.name}
              name={field.name}
              label={field.label || ''}
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
            />
          )
      }
    },
    [control, errors, onUserTypeChange]
  )

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xs mx-auto">
        {fields.map(renderField)}
        <div className="flex justify-between gap-3">
          {showBackButton && onBack && (
            <Button type="button" onClick={onBack} variant="secondary">
              {Buttons.BACK}
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isLastStep ? Buttons.SUBMIT : Buttons.NEXT}
          </Button>
        </div>
        {hasError && (
          <span className="text-red-500 text-sm">{SubmittingStatus.ERROR}</span>
        )}
      </form>
    </FormProvider>
  )
}
export default memo(FormComponent) as typeof FormComponent
