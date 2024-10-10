// Form.tsx

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
import { getAllFieldsValidationSchema, validationSchema } from '../../utils/validationSchema'
import { applyDateMask } from '../../utils/dateMask'
import { FormProps, FormField } from '../../../types/step-form'

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
    : yup.object().shape(validationSchema[stepId as keyof typeof validationSchema])

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
            className="flex flex-row justify-start items-center"
          >
            {field.options?.map((option) => (
              <label
                key={option.value}
                className="flex justify-center mb-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                <input
                  type="radio"
                  value={option.value}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2"
                  {...register(field.name as Path<TFieldValues>, {
                    required: field.required
                      ? `${field.label} is required`
                      : false,
                    onChange: (e) =>
                      onUserTypeChange && onUserTypeChange(e.target.value),
                  })}
                />
                {option.label}
              </label>
            ))}
          </div>
        )
      case 'date':
        return (
          <div key={field.name} className="mb-6">
            <label
              htmlFor={field.name}
              className="block mb-2 text-sm font-semibold text-black-900 dark:text-black-400"
            >
              {field.label}
            </label>
            <Controller
              name={field.name as Path<TFieldValues>}
              control={control}
              rules={{
                required: field.required ? `${field.label} is required` : false,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <input
                  type="text"
                  placeholder={'DD/MM/AAAA'}
                  value={value as string}
                  onChange={(e) => {
                    const maskedValue = applyDateMask(e.target.value)
                    onChange(maskedValue)
                  }}
                  onBlur={onBlur}
                  className="border border-black-500 text-black-900 dark:text-black-400 placeholder-black-700 dark:placeholder-black-500 text-sm rounded-lg focus:ring-black-500 focus:border-black-500 block w-full p-2.5 dark:border-black-500"
                />
              )}
            />
            {errors[field.name as Path<TFieldValues>] && (
              <span className="text-red-500 text-sm">
                {errors[field.name as Path<TFieldValues>]?.message as string}
              </span>
            )}
          </div>
        )
      default:
        return (
          <div key={field.name} className="mb-6">
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
              <span>
                {errors[field.name as Path<TFieldValues>]?.message as string}
              </span>
            )}
          </div>
        )
    }
  }
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto">
        {fields.map(renderField)}
        <div className="flex justify-between">
          {showBackButton && onBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-yellow-500 hover:text-white border border-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-10 py-2.5 text-center me-2 mb-2 dark:border-yellow-500 dark:text-yellow-500 dark:hover:text-white dark:hover:bg-yellow-600 dark:focus:ring-yellow-900"
            >
              Voltar
            </button>
          )}
          <button
            type="submit"
            className="focus:outline-none text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-10 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
          >
            {isLastStep ? 'Cadastrar' : 'Continuar'}
          </button>
        </div>
      </form>
    </FormProvider>
  )
}
export default Form
