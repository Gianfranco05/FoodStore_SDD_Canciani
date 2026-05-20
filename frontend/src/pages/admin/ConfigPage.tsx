import { useCallback, useActionState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../lib/adminApi'
import { Button, Card, PageContainer } from '../../shared/ui'
import { HorariosEditor } from '../../shared/ui/HorariosEditor'
import { useUIStore } from '../../stores/uiStore'
import { handleError } from '../../shared/utils/logger'
import type { FormState } from '../../shared/types/form'
import { helpContent } from './helpContent'

interface ConfigItem {
  clave: string
  valor: string
  updated_by: string | null
  updated_at: string | null
}

const HORARIOS_KEY = 'horarios_local'

function parseConfigs(configs: ConfigItem[]) {
  const normal: ConfigItem[] = []
  let horariosValor = ''
  for (const c of configs) {
    if (c.clave === HORARIOS_KEY) {
      horariosValor = c.valor
    } else {
      normal.push(c)
    }
  }
  return { normal, horariosValor }
}

export default function ConfigPage() {
  const queryClient = useQueryClient()
  const addToast = useUIStore((s) => s.addToast)

  const { data: configs, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-config'],
    queryFn: () => adminApi.getConfig(),
  })

  const { normal: normalConfigs, horariosValor } = parseConfigs(configs ?? [])

  const submitAction = useCallback(
    async (_prevState: FormState, formData: FormData): Promise<FormState> => {
      const values: Record<string, string> = {}
      for (const [key, value] of formData.entries()) {
        if (key.startsWith('config_')) {
          const configKey = key.slice(7)
          values[configKey] = value as string
        }
      }

      try {
        await adminApi.updateConfig(values)
        queryClient.invalidateQueries({ queryKey: ['admin-config'] })
        addToast('Configuración actualizada correctamente', 'success')
        return { isSuccess: true, message: 'Guardado correctamente' }
      } catch (error) {
        const message = handleError(error, 'ConfigPage.submitAction')
        addToast(`Error al guardar: ${message}`, 'error')
        return { isSuccess: false, message: `Error: ${message}` }
      }
    },
    [queryClient, addToast]
  )

  const [, formAction, isPending] = useActionState<FormState, FormData>(submitAction, {
    isSuccess: false,
  })

  const hasConfigs = (configs ?? []).length > 0

  if (isLoading) {
    return (
      <PageContainer
        title="Configuración del Sistema"
        description="Parámetros generales del sistema"
        helpContent={helpContent.config}
      >
        <Card className="p-6">
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
        </Card>
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer
        title="Configuración del Sistema"
        description="Parámetros generales del sistema"
        helpContent={helpContent.config}
      >
        <Card className="p-6">
          <div className="text-center py-8">
            <h3 className="text-destructive font-semibold mb-2">Error al cargar configuración</h3>
            <Button onClick={() => refetch()}>Reintentar</Button>
          </div>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="Configuración del Sistema"
      description="Parámetros generales del sistema"
      helpContent={helpContent.config}
      actions={
        !hasConfigs ? null : (
          <Button type="submit" form="config-form" isLoading={isPending}>
            Guardar
          </Button>
        )
      }
    >
      <form id="config-form" action={formAction}>
        {!hasConfigs ? (
          <Card className="p-6 text-center text-muted-foreground">
            <p className="text-lg font-medium">Sin configuraciones</p>
            <p className="text-sm mt-1">No hay configuraciones del sistema todavía. Agregalas vía API.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Configs normales (texto plano) */}
            {normalConfigs.length > 0 && (
              <Card className="overflow-hidden">
                <div className="divide-y divide-border">
                  {normalConfigs.map((config: ConfigItem) => (
                    <div key={config.clave} className="p-4 sm:flex sm:items-start sm:gap-4">
                      <div className="sm:w-1/3 mb-2 sm:mb-0">
                        <label className="block text-sm font-medium text-foreground">
                          {config.clave.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                        </label>
                        {config.updated_by && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Última modificación: {config.updated_by}
                            {config.updated_at && ` — ${new Date(config.updated_at).toLocaleDateString()}`}
                          </p>
                        )}
                      </div>
                      <div className="sm:w-2/3">
                        <textarea
                          name={`config_${config.clave}`}
                          defaultValue={config.valor}
                          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background text-foreground"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Horarios del Local */}
            <Card>
              <div className="px-4 py-3 bg-muted/50 border-b border-border">
                <p className="text-sm font-medium text-foreground uppercase tracking-wider">
                  Horarios del Local
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configurá los horarios de apertura y cierre para cada día de la semana.
                  Usá <strong>+ turno</strong> para agregar un segundo turno (ej. turno mañana y tarde).
                </p>
              </div>
              <div className="p-4">
                <HorariosEditor
                  valor={horariosValor}
                  onChange={(json) => {
                    // Sync the hidden input for form submission
                    const hidden = document.querySelector<HTMLInputElement>('input[name="config_horarios_local"]')
                    if (hidden) hidden.value = json
                  }}
                />
                <input type="hidden" name="config_horarios_local" defaultValue={horariosValor} />
              </div>
            </Card>
          </div>
        )}
      </form>
    </PageContainer>
  )
}
