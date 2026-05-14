import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '../shared/ui/Button'
import { usePaymentStore } from '../stores/paymentStore'

export default function PagoFallidoPage() {
  const { id } = useParams<{ id: string }>()
  const { setPaymentStatus, reset } = usePaymentStore()

  useEffect(() => {
    setPaymentStatus('rejected')
    return () => reset()
  }, [setPaymentStatus, reset])

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-800">Pago rechazado</h1>
        <p className="mb-6 text-gray-600">
          El pago para el pedido <strong>#{id}</strong> no pudo ser procesado.
          Podés intentar nuevamente con otro medio de pago.
        </p>
        <div className="flex justify-center gap-3">
          <Link to={`/orders/${id}`}>
            <Button>Reintentar pago</Button>
          </Link>
          <Link to="/orders">
            <Button variant="outline">Mis pedidos</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
