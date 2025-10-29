export const strategy_calendar: EventoEstrategico[] = [
  {
    fecha: '2025-10-28T00:00:00-03:00',
    tipo: 'Inicio de Phase 1',
    decisión: 'Validar targetContextualizer.ts sin interferencias',
    firmadoPor: '_AUREO'
  },
  {
    fecha: '2025-11-04T00:00:00-03:00',
    tipo: 'Inicio de Phase 2',
    decisión: 'Sembrar contextForecaster.ts como fuente única de verdad ambiental',
    firmadoPor: '_AUREO'
  },
  {
    fecha: '2025-11-05T00:00:00-03:00',
    tipo: 'Evaluación de win rate',
    decisión: 'Si winRate > 40%, activar migración completa',
    firmadoPor: '_AUREO'
  }
]

type EventoEstrategico = {
  fecha: string
  tipo: string
  decisión: string
  firmadoPor: string
}
