import { FieldValues, useFormContext } from 'react-hook-form'
import { UserTypeSelectionProps } from '../../../types/step-form'

export function UserTypeSelectionField<TFieldValues extends FieldValues>({
  name,
  label,
  options,
  onUserTypeChange,
}: UserTypeSelectionProps<TFieldValues>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TFieldValues>()
  const fieldId = `userType-${name}`
  const error = errors[name]

  return (
    <fieldset className="mb-4">
      <legend className="sr-only">{label}</legend>
      <div className="flex flex-row justify-between items-center">
        {options.map((option) => (
          <div className="flex items-center mb-4" key={option.value}>
            <input
              id={`${fieldId}-${option.value}`}
              type="radio"
              value={option.value}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              {...register(name, {
                onChange: (e) =>
                  onUserTypeChange && onUserTypeChange(e.target.value),
              })}
              aria-describedby={`${fieldId}-description`}
            />
            <label
              htmlFor={`${fieldId}-${option.value}`}
              className="ml-2 text-sm font-medium text-gray-900"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${fieldId}-error`}>
          {error.message as string}
        </p>
      )}
    </fieldset>
  )
}
