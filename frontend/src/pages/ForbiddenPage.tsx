import { Link } from 'react-router-dom'
import { Button } from '../shared/ui/Button'

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-destructive mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Acceso Denegado</h2>
        <p className="text-muted-foreground mb-6">
          No tenés permisos para acceder a esta página.
        </p>
        <Link to="/">
          <Button>Volver al Inicio</Button>
        </Link>
      </div>
    </div>
  )
}
