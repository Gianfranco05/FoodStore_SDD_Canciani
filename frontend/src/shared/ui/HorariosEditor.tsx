import { useState, useCallback } from 'react'
import { cn } from '../../lib/utils'

// ─── Types ────────────────────────────────────────────────────────

export interface Turno {
  apertura: string
  cierre: string
}

export interface DiaHorario {
  abierto: boolean
  turnos: Turno[]
}

export type HorariosData = Record<string, DiaHorario>

const DIAS_ORDENADOS = [
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
  'domingo',
] as const

const DIAS_LABELS: Record<string, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo',
}

// ─── Helpers ──────────────────────────────────────────────────────

function parseHorarios(valor: string): HorariosData {
  try {
    const parsed = JSON.parse(valor)
    // Asegurar que todos los días existan
    const result: HorariosData = {}
    for (const dia of DIAS_ORDENADOS) {
      result[dia] = parsed[dia] ?? { abierto: true, turnos: [{ apertura: '08:00', cierre: '15:00' }] }
    }
    return result
  } catch {
    // Default si no se puede parsear
    const defaults: HorariosData = {}
    for (const dia of DIAS_ORDENADOS) {
      defaults[dia] = { abierto: true, turnos: [{ apertura: '08:00', cierre: '15:00' }] }
    }
    return defaults
  }
}

function serializeHorarios(data: HorariosData): string {
  return JSON.stringify(data, null, 2)
}

// ─── Component ────────────────────────────────────────────────────

interface HorariosEditorProps {
  /** Valor actual del campo (JSON string) */
  valor: string
  /** Callback cuando cambia (devuelve el JSON string) */
  onChange: (valor: string) => void
}

export function HorariosEditor({ valor, onChange }: HorariosEditorProps) {
  const [data, setData] = useState<HorariosData>(() => parseHorarios(valor))

  const updateDia = useCallback(
    (dia: string, partial: Partial<DiaHorario>) => {
      setData((prev) => {
        const next = {
          ...prev,
          [dia]: { ...prev[dia], ...partial },
        }
        onChange(serializeHorarios(next))
        return next
      })
    },
    [onChange],
  )

  const updateTurno = useCallback(
    (dia: string, idx: number, partial: Partial<Turno>) => {
      setData((prev) => {
        const turnos = [...(prev[dia]?.turnos ?? [])]
        turnos[idx] = { ...turnos[idx], ...partial }
        const next = {
          ...prev,
          [dia]: { ...prev[dia], turnos },
        }
        onChange(serializeHorarios(next))
        return next
      })
    },
    [onChange],
  )

  const addTurno = useCallback(
    (dia: string) => {
      setData((prev) => {
        const turnos = [...(prev[dia]?.turnos ?? []), { apertura: '19:00', cierre: '23:00' }]
        const next = { ...prev, [dia]: { ...prev[dia], turnos } }
        onChange(serializeHorarios(next))
        return next
      })
    },
    [onChange],
  )

  const removeTurno = useCallback(
    (dia: string, idx: number) => {
      setData((prev) => {
        const turnos = (prev[dia]?.turnos ?? []).filter((_, i) => i !== idx)
        const next = { ...prev, [dia]: { ...prev[dia], turnos } }
        onChange(serializeHorarios(next))
        return next
      })
    },
    [onChange],
  )

  const isWeekend = (dia: string) => dia === 'sabado' || dia === 'domingo'

  return (
    <div className="space-y-2">
      {DIAS_ORDENADOS.map((dia) => {
        const diaData = data[dia] ?? { abierto: true, turnos: [{ apertura: '08:00', cierre: '15:00' }] }
        return (
          <div
            key={dia}
            className={cn(
              'flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg border transition-colors',
              isWeekend(dia) ? 'bg-muted/30 border-border/50' : 'bg-background border-border',
              !diaData.abierto && 'opacity-50',
            )}
          >
            {/* Day name + toggle */}
            <div className="flex items-center gap-2 sm:w-36 shrink-0">
              <button
                type="button"
                onClick={() => updateDia(dia, { abierto: !diaData.abierto })}
                className={cn(
                  'w-7 h-7 rounded-md border flex items-center justify-center text-xs font-bold transition-colors',
                  diaData.abierto
                    ? 'bg-green-100 text-green-700 border-green-300'
                    : 'bg-red-100 text-red-700 border-red-300',
                )}
                title={diaData.abierto ? 'Cerrar este día' : 'Abrir este día'}
                aria-label={`${diaData.abierto ? 'Cerrar' : 'Abrir'} ${DIAS_LABELS[dia]}`}
              >
                {diaData.abierto ? '✓' : '✗'}
              </button>
              <span className="text-sm font-medium text-foreground">{DIAS_LABELS[dia]}</span>
            </div>

            {/* Turnos */}
            <div className="flex-1 flex flex-wrap items-center gap-2">
              {diaData.abierto &&
                diaData.turnos.map((turno, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <input
                      type="time"
                      value={turno.apertura}
                      onChange={(e) => updateTurno(dia, idx, { apertura: e.target.value })}
                      className="w-24 rounded-md border border-border bg-background px-2 py-1 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`${DIAS_LABELS[dia]} turno ${idx + 1} apertura`}
                    />
                    <span className="text-xs text-muted-foreground">a</span>
                    <input
                      type="time"
                      value={turno.cierre}
                      onChange={(e) => updateTurno(dia, idx, { cierre: e.target.value })}
                      className="w-24 rounded-md border border-border bg-background px-2 py-1 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`${DIAS_LABELS[dia]} turno ${idx + 1} cierre`}
                    />
                    {idx === 0 && diaData.turnos.length < 3 && (
                      <button
                        type="button"
                        onClick={() => addTurno(dia)}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors p-1"
                        title="Agregar turno"
                        aria-label={`Agregar turno a ${DIAS_LABELS[dia]}`}
                      >
                        + turno
                      </button>
                    )}
                    {diaData.turnos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTurno(dia, idx)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors p-1"
                        title="Quitar turno"
                        aria-label={`Quitar turno de ${DIAS_LABELS[dia]}`}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              {!diaData.abierto && (
                <span className="text-xs text-muted-foreground italic">Cerrado</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
