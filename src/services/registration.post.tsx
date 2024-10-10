import { RegistrationData } from '../../types/registration-service'

export const registrationPost = async (
  data: RegistrationData
): Promise<RegistrationOptions> => {
  return new Promise<RegistrationOptions>(async (resolve, reject) => {
    try {
      const response = await fetch('http://localhost:3000/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      const result = await response.json()
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}
