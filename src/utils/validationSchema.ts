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
    DOCUMENT: yup.string().when('userType', {
      is: (userType: string) => userType === 'CPF',
      then: (schema) =>
        schema
          .matches(/^\d{11}$/, 'CPF inválido')
          .required('CPF é obrigatório'),
      otherwise: (schema) =>
        schema
          .matches(/^\d{14}$/, 'CNPJ inválido')
          .required('CNPJ é obrigatório'),
    }),
    BIRTH: yup
      .string()
      .matches(dateRegex, 'Data inválida. Use o formato DD/MM/AAAA')
      .required('Data de nascimento é obrigatória')
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
