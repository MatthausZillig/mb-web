import { useFormContext } from 'react-hook-form'

interface TextFieldProps {
  name: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
}

export function TextField({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
}: TextFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const error = errors[name]

  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-semibold text-black-900 dark:text-black-400"
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name, {
          required: required ? `${label} is required` : false,
        })}
        className="border border-black-500 text-black-900 dark:text-black-400 placeholder-black-700 dark:placeholder-black-500 text-sm rounded-lg focus:ring-black-500 focus:border-black-500 block w-full p-2.5 dark:border-black-500"
        aria-invalid={error ? 'true' : 'false'}
      />
      {error && (
        <span className="text-red-500 text-sm" role="alert">
          {error.message as string}
        </span>
      )}
    </div>
  )
}
