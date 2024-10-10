// validationConfig.ts

import * as yup from 'yup'

export enum StepId {
  STEP_1 = 'STEP_1',
  STEP_2 = 'STEP_2',
  STEP_3 = 'STEP_3',
  STEP_4 = 'STEP_4',
}

type ValidationSchema = {
  [key in StepId]: {
    [fieldName: string]: yup.Schema<any>
  }
}

const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/

const documentValidation = yup
  .string()
  .test('document-validation', 'Documento inválido', function (value) {
    const userType = this.parent.userType
    if (userType === 'CPF') {
      return (
        /^\d{11}$/.test(value || '') ||
        this.createError({ message: 'CPF inválido' })
      )
    } else if (userType === 'CNPJ') {
      return (
        /^\d{14}$/.test(value || '') ||
        this.createError({ message: 'CNPJ inválido' })
      )
    }
    return this.createError({ message: 'Tipo de usuário inválido' })
  })
  .required('Documento é obrigatório')

export const validationSchema: ValidationSchema = {
  [StepId.STEP_1]: {
    EMAIL: yup.string().email('Email inválido').required('Email é obrigatório'),
    userType: yup
      .string()
      .oneOf(['CPF', 'CNPJ'], 'Selecione um tipo de usuário')
      .required('Tipo de usuário é obrigatório'),
  },
  [StepId.STEP_2]: {
    NAME: yup.string().required('Nome é obrigatório'),
    DOCUMENT: documentValidation,
    BIRTH: yup
      .string()
      .matches(dateRegex, 'Data inválida. Use o formato DD/MM/AAAA')
      .required('Data é obrigatória')
      .test('valid-date', 'Data inválida', function (value) {
        if (!value) return false
        const [day, month, year] = value.split('/')
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        )
        return (
          date.getDate() === parseInt(day) &&
          date.getMonth() === parseInt(month) - 1 &&
          date.getFullYear() === parseInt(year) &&
          date <= new Date()
        )
      }),
    PHONE: yup
      .string()
      .matches(/^\d{10,11}$/, 'Telefone inválido')
      .required('Telefone é obrigatório'),
  },
  [StepId.STEP_3]: {
    PASSWORD: yup
      .string()
      .min(8, 'Senha deve ter pelo menos 8 caracteres')
      .required('Senha é obrigatória'),
  },
  [StepId.STEP_4]: {},
}

export const getAllFieldsValidationSchema = () => {
  return yup.object().shape({
    ...Object.values(validationSchema).reduce((acc, stepSchema) => {
      return { ...acc, ...stepSchema }
    }, {}),
    DOCUMENT: documentValidation,
  })
}
