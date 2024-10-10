import { RegistrationData } from '../../types/registration-service'

export interface RegistrationResponse {
  success: boolean
  message: string
  status: number
  data?: any
}

export const registrationPost = async (
  data: RegistrationData
): Promise<RegistrationResponse> => {
  try {
    const response = await fetch('http://localhost:3000/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    return {
      success: response.ok,
      status: response.status,
      message:
        result.message ||
        (response.ok ? 'Registration successful' : 'Registration failed'),
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message:
        error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}
