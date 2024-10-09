// FormBuilder.tsx

import React, { useEffect, useMemo } from "react"
import { FormProvider, useForm, FieldValues, DefaultValues, Path } from "react-hook-form"

export interface FormFieldProps {
  name: string
  type: string
  label: string
  placeholder?: string
  required?: boolean
}

export interface FormBuilderProps<TFieldValues extends FieldValues> {
  fields: Array<FormFieldProps>
  defaultValues: DefaultValues<TFieldValues>
  showBackButton?: boolean
  onSubmit: (values: TFieldValues) => void
  onBack?: (values: TFieldValues) => void
}

function FormBuilder<TFieldValues extends FieldValues>({
  fields,
  defaultValues,
  showBackButton = false,
  onSubmit,
  onBack
}: Readonly<FormBuilderProps<TFieldValues>>): React.ReactElement {
  const formMethods = useForm<TFieldValues>({
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  })

  const { handleSubmit, reset, register } = formMethods

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const handleOnBack = () => {
    if (onBack) {
      const values = formMethods.getValues()
      onBack(values)
    }
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map(({ name, type, label, placeholder, required }) => (
          <div key={name}>
            <label htmlFor={name}>{label}</label>
            <input
              id={name}
              type={type}
              placeholder={placeholder}
              {...register(name as Path<TFieldValues>, { required })}
            />
          </div>
        ))}
        {showBackButton && onBack && (
          <button type="button" onClick={handleOnBack}>
            Back
          </button>
        )}
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  )
}

export default FormBuilder
