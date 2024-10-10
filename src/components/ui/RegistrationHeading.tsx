import React from 'react'

interface RegistrationHeadingProps {
  title: string
  step: number
}

export function RegistrationHeading({
  title,
  step,
}: Readonly<RegistrationHeadingProps>): React.ReactElement {
  return (
    <div className="flex flex-col items-start justify-center max-w-sm mx-auto my-6">
      <p className="text-sm font-medium text-gray-900">
        Etapa <span className="text-yellow-500"> {step} </span> de 4
      </p>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    </div>
  )
}
