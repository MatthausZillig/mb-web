import React from 'react'
import {
  FormProvider,
  useForm,
  FieldValues,
  Path,
  DefaultValues,
  Controller,
  Resolver,
  ResolverOptions,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  getAllFieldsValidationSchema,
  validationSchema,
} from '../../utils/validationSchema'
import { applyDateMask } from '../../utils/dateMask'
import { FormProps, FormField } from '../../../types/step-form'
import { Buttons } from '../../constants/forms'
import DateField from './DateField'

function Form<TFieldValues extends FieldValues>({
  fields,
  formData,
  showBackButton = false,
  stepId,
  isLastStep,
  onSubmit,
  onBack,
  onUserTypeChange,
}: Readonly<FormProps<TFieldValues>>): React.ReactElement {
  const schema = isLastStep
    ? getAllFieldsValidationSchema()
    : yup
        .object()
        .shape(validationSchema[stepId as keyof typeof validationSchema])

  const customResolver: Resolver<TFieldValues> = async (
    values,
    context,
    options
  ) => {
    const yupResult = await yupResolver(schema)(
      values,
      context,
      options as ResolverOptions<FieldValues>
    )
    return {
      values: yupResult.values as TFieldValues,
      errors: yupResult.errors,
    }
  }

  const formMethods = useForm<TFieldValues>({
    defaultValues: formData as DefaultValues<TFieldValues>,
    resolver: customResolver,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = formMethods

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'userTypeSelection':
        return (
          <div
            key={field.name}
            className="flex flex-row justify-between items-center"
          >
            {field.options?.map((option) => (
              <div className="flex items-center mb-4" key={option.label}>
                <input
                  type="radio"
                  value={option.value}
                  className="flex justify-center w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2"
                  {...register(field.name as Path<TFieldValues>, {
                    required: field.required
                      ? `${field.label} is required`
                      : false,
                    onChange: (e) =>
                      onUserTypeChange && onUserTypeChange(e.target.value),
                  })}
                />
                <label
                  key={option.value}
                  className="flex justify-center text-sm font-medium text-gray-900"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
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
          <div key={field.name} className="mb-4">
            <label
              htmlFor={field.name}
              className="block mb-2 text-sm font-semibold text-black-900 dark:text-black-400"
            >
              {field.label}
            </label>
            <input
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              {...register(field.name as Path<TFieldValues>, {
                required: field.required ? `${field.label} is required` : false,
              })}
              className="border border-black-500 text-black-900 dark:text-black-400 placeholder-black-700 dark:placeholder-black-500 text-sm rounded-lg focus:ring-black-500 focus:border-black-500 block w-full p-2.5 dark:border-black-500"
            />
            {errors[field.name as Path<TFieldValues>] && (
              <span className="text-red-500 text-sm">
                {errors[field.name as Path<TFieldValues>]?.message as string}
              </span>
            )}
          </div>
        )
    }
  }
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
            className="focus:outline-none text-white bg-yellow-500 hover:bg-yellow-600 focus:ring focus:ring-transparent font-medium rounded-lg text-sm px-10 py-2.5 mb-2 w-full"
          >
            {isLastStep ? Buttons.SUBMIT : Buttons.NEXT}
          </button>
        </div>
      </form>
    </FormProvider>
  )
}
export default Form
