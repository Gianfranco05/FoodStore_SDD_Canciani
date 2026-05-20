import axios from 'axios'

export function handleError(error: unknown, context: string): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string') return detail
    if (typeof detail?.detail === 'string') return detail.detail
    if (error.response?.status === 429) return 'Demasiadas solicitudes. Intentá de nuevo en unos minutos.'
    return error.message || 'Error de conexión con el servidor'
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  console.error(`[${context}] Unexpected error:`, error)
  return 'Ocurrió un error inesperado'
}

export function logWarning(message: string, context?: string) {
  const prefix = context ? `[${context}]` : '[Warning]'
  console.warn(`${prefix} ${message}`)
}
