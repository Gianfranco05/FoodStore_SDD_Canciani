import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '../shared/ui/Button'
import { usePaymentStore } from '../stores/paymentStore'

export default function PagoPendientePage() {
  const { id } = useParams<{ id: string }>()
  const { setPaymentStatus, reset } = usePaymentStore()

  useEffect(() => {
    setPaymentStatus('pending')
    return () => reset()
  }, [setPaymentStatus, reset])

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
          <svg className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-800">Pago en proceso</h1>
        <p className="mb-6 text-gray-600">
          El pago para el pedido <strong>#{id}</strong> está siendo procesado.
          Esto puede tomar unos minutos. Te recomendamos revisar el estado del pedido más tarde.
        </p>
        <div className="flex justify-center gap-3">
          <Link to={`/orders/${id}`}>
            <Button>Ver pedido</Button>
          </Link>
          <Link to="/orders">
            <Button variant="outline">Mis pedidos</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
