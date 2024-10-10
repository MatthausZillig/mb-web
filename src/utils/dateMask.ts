export function applyDateMask(value: string): string {
  const numericValue = value.replace(/\D/g, '')

  let maskedValue = ''
  for (let i = 0; i < numericValue.length && i < 8; i++) {
    if (i === 2 || i === 4) {
      maskedValue += '/'
    }
    maskedValue += numericValue[i]
  }

  return maskedValue
}
