import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export function TestConnection() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get('/test')
      .then(res => {
        setStatus('success')
        setMessage(res.data.message)
        console.log('✅ Conexión exitosa:', res.data)
      })
      .catch(err => {
        setStatus('error')
        setMessage(err.message)
        console.error('❌ Error de conexión:', err)
      })
  }, [])

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">🔗 Prueba de Conexión Frontend → Backend</h2>
      {status === 'loading' && <p className="text-muted-foreground">⏳ Probando conexión...</p>}
      {status === 'success' && (
        <div className="text-primary">
          <p className="font-medium">✅ {message}</p>
          <p className="text-sm text-muted-foreground mt-1">La aplicación está funcionando correctamente</p>
        </div>
      )}
      {status === 'error' && (
        <div className="text-destructive">
          <p className="font-medium">❌ Error de conexión</p>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
        </div>
      )}
    </div>
  )
}