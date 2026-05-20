export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

type Rule = (value: string, label: string) => string | null

export function required(message?: string): Rule {
  return (value: string, label: string) => {
    if (!value || value.trim().length === 0) return message || `${label} es requerido`
    return null
  }
}

export function minLength(min: number, message?: string): Rule {
  return (value: string, label: string) => {
    if (value.length < min) return message || `${label} debe tener al menos ${min} caracteres`
    return null
  }
}

export function maxLength(max: number, message?: string): Rule {
  return (value: string, label: string) => {
    if (value.length > max) return message || `${label} debe tener máximo ${max} caracteres`
    return null
  }
}

export function email(message?: string): Rule {
  return (value: string, label: string) => {
    if (!value) return null // skip if empty (use required for that)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return message || `${label} no es un email válido`
    return null
  }
}

export function isNumber(message?: string): Rule {
  return (value: string, label: string) => {
    if (!value) return null
    if (isNaN(Number(value)) || value.trim() === '') return message || `${label} debe ser un número`
    return null
  }
}

export function min(minValue: number, message?: string): Rule {
  return (value: string, label: string) => {
    if (!value) return null
    const num = Number(value)
    if (isNaN(num)) return `${label} debe ser un número`
    if (num < minValue) return message || `${label} debe ser al menos ${minValue}`
    return null
  }
}

export function validate(
  fields: Record<string, string>,
  rules: Record<string, Rule[]>,
  labels: Record<string, string>
): ValidationResult {
  const errors: Record<string, string> = {}

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = fields[field] ?? ''
    const label = labels[field] ?? field

    for (const rule of fieldRules) {
      const error = rule(value, label)
      if (error) {
        errors[field] = error
        break // first error per field
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
