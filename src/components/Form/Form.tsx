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
import { FormProps, FormField } from '../../../types/step-form'
import { Buttons, SubmittingStatus } from '../../constants/forms'
import { DateField } from './DateField'
import { UserTypeSelectionField } from './UserTypeSelectionField'
import { TextField } from './TextField'

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
          return (
            <DateField
              key={field.name}
              field={field}
              control={control}
              errors={errors}
            />
          )
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
            <button
              type="button"
              onClick={onBack}
              className="text-yellow-500 hover:text-white border border-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-transparent font-medium rounded-lg text-sm px-10 py-2.5 text-center mb-2 dark:border-yellow-500 dark:text-yellow-500 dark:hover:text-white dark:hover:bg-yellow-600"
            >
              {Buttons.BACK}
            </button>
          )}
          <button
            type="submit"
            className="flex items-center justify-evenly focus:outline-none text-white bg-yellow-500 hover:bg-yellow-600 focus:ring focus:ring-transparent font-medium rounded-lg text-sm px-10 py-2.5 mb-2 w-full"
            disabled={isSubmitting}
          >
            {isLastStep ? Buttons.SUBMIT : Buttons.NEXT}
            {isSubmitting && (
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 me-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
        </div>
        {hasError && (
          <span className="text-red-500 text-sm">{SubmittingStatus.ERROR}</span>
        )}
      </form>
    </FormProvider>
  )
}
export default memo(FormComponent) as typeof FormComponent
