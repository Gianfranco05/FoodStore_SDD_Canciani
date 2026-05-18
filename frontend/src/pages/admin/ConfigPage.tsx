import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../lib/adminApi'
import { useUIStore } from '../../stores/uiStore'

interface ConfigItem {
  clave: string
  valor: string
  updated_by: string | null
  updated_at: string | null
}

export default function ConfigPage() {
  const queryClient = useQueryClient()
  const addToast = useUIStore((s) => s.addToast)
  const [editValues, setEditValues] = useState<Record<string, string>>({})

  const { data: configs, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-config'],
    queryFn: () => adminApi.getConfig(),
  })

  useEffect(() => {
    if (configs) {
      const values: Record<string, string> = {}
      configs.forEach((c: ConfigItem) => { values[c.clave] = c.valor })
      setEditValues((prev) => {
        // Only set if prev is empty (first load)
        if (Object.keys(prev).length === 0) return values
        return prev
      })
    }
  }, [configs])

  const saveMutation = useMutation({
    mutationFn: (data: Record<string, string>) => adminApi.updateConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-config'] })
      addToast('Configuración actualizada correctamente', 'success')
    },
    onError: () => {
      addToast('Error al guardar la configuración', 'error')
    },
  })

  const handleSave = () => {
    saveMutation.mutate(editValues)
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6 text-center">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-destructive font-semibold mb-2">Error al cargar configuración</h3>
          <button onClick={() => refetch()} className="px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 text-sm">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Configuración del Sistema</h1>
        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 text-sm font-medium"
        >
          {saveMutation.isPending ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border divide-y divide-border">
        {(configs ?? []).length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <p className="text-lg font-medium">Sin configuraciones</p>
            <p className="text-sm mt-1">No hay configuraciones del sistema todavía. Agregalas vía API.</p>
          </div>
        ) : (
          (configs ?? []).map((config: ConfigItem) => (
            <div key={config.clave} className="p-4 sm:flex sm:items-start sm:gap-4">
              <div className="sm:w-1/3 mb-2 sm:mb-0">
                <label className="block text-sm font-medium text-foreground">{config.clave}</label>
                {config.updated_by && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Última modificación: {config.updated_by}
                    {config.updated_at && ` — ${new Date(config.updated_at).toLocaleDateString()}`}
                  </p>
                )}
              </div>
              <div className="sm:w-2/3">
                <textarea
                  value={editValues[config.clave] ?? config.valor}
                  onChange={(e) => setEditValues((prev) => ({ ...prev, [config.clave]: e.target.value }))}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  rows={2}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Próximas configuraciones */}
      <div className="bg-card rounded-xl shadow-sm border border-border divide-y divide-border opacity-60">
        <div className="px-4 py-3 bg-muted/50">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Próximamente más configuraciones
          </p>
        </div>

        <div className="p-4 sm:flex sm:items-start sm:gap-4">
          <div className="sm:w-1/3 mb-2 sm:mb-0">
            <span className="block text-sm font-medium text-muted-foreground">Tiempo de preparación por defecto</span>
            <span className="text-xs text-muted-foreground/60 mt-0.5">Tiempo estimado en minutos para nuevos productos</span>
          </div>
          <div className="sm:w-2/3">
            <div className="w-full border border-dashed border-border rounded-lg px-3 py-2 text-sm text-muted-foreground/40 italic">
              Próximamente
            </div>
          </div>
        </div>

        <div className="p-4 sm:flex sm:items-start sm:gap-4">
          <div className="sm:w-1/3 mb-2 sm:mb-0">
            <span className="block text-sm font-medium text-muted-foreground">Porcentaje de IVA</span>
            <span className="text-xs text-muted-foreground/60 mt-0.5">Impuesto aplicado a todos los productos</span>
          </div>
          <div className="sm:w-2/3">
            <div className="w-full border border-dashed border-border rounded-lg px-3 py-2 text-sm text-muted-foreground/40 italic">
              Próximamente
            </div>
          </div>
        </div>

        <div className="p-4 sm:flex sm:items-start sm:gap-4">
          <div className="sm:w-1/3 mb-2 sm:mb-0">
            <span className="block text-sm font-medium text-muted-foreground">Costo de envío</span>
            <span className="text-xs text-muted-foreground/60 mt-0.5">Monto fijo o mínimo para envío gratis</span>
          </div>
          <div className="sm:w-2/3">
            <div className="w-full border border-dashed border-border rounded-lg px-3 py-2 text-sm text-muted-foreground/40 italic">
              Próximamente
            </div>
          </div>
        </div>

        <div className="p-4 sm:flex sm:items-start sm:gap-4">
          <div className="sm:w-1/3 mb-2 sm:mb-0">
            <span className="block text-sm font-medium text-muted-foreground">Horarios del local</span>
            <span className="text-xs text-muted-foreground/60 mt-0.5">Horario de apertura y cierre</span>
          </div>
          <div className="sm:w-2/3">
            <div className="w-full border border-dashed border-border rounded-lg px-3 py-2 text-sm text-muted-foreground/40 italic">
              Próximamente
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
