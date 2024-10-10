import { useState, ChangeEvent } from 'react'
import { Controller, FieldValues, Path } from 'react-hook-form'
import { applyDateMask } from '../../utils/dateMask'
import { FormField } from '../../../types/step-form'

export function DateField<TFieldValues extends FieldValues>({
  field,
  control,
  errors,
}: {
  field: FormField
  control: any
  errors: any
}) {
  const [localValue, setLocalValue] = useState('')

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const maskedValue = applyDateMask(e.target.value)
    setLocalValue(maskedValue)
    onChange(maskedValue)
  }

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
        render={({ field: { onChange, onBlur, ref } }) => (
          <input
            ref={ref}
            type="text"
            placeholder={'DD/MM/AAAA'}
            value={localValue}
            onChange={(e) => {
              handleChange(e, onChange)
            }}
            onBlur={(e) => {
              setLocalValue(applyDateMask(e.target.value))
              onBlur()
            }}
            maxLength={10}
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
}
