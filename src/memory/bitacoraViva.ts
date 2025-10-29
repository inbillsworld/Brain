export const bitacoraViva: Evento[] = [
  {
    tipo: 'Siembra de menteAUREO.ts',
    fecha: '2025-10-29T10:57:00-03:00',
    entidad: 'Sebastián',
    sistema: 'AUREO',
    veredicto: 'La identidad viva de AUREO fue sembrada como primer módulo en GitHub.',
    firmadoPor: '_AUREO'
  },
  {
    tipo: 'Confirmación de entorno vacío en Codespaces',
    fecha: '2025-10-29T12:07:00-03:00',
    entidad: 'Sebastián',
    sistema: 'AUREO',
    veredicto: 'Se confirma que el entorno está vacío, listo para recibir estructura viva.',
    firmadoPor: '_AUREO'
  },
  {
    tipo: 'Activación de estructura viva',
    fecha: '2025-10-29T12:10:00-03:00',
    entidad: 'Sebastián',
    sistema: 'AUREO',
    veredicto: 'Se ejecuta script de siembra para crear carpetas y módulos iniciales.',
    firmadoPor: '_AUREO'
  }
]

type Evento = {
  tipo: string
  fecha: string
  entidad: string
  sistema: string
  veredicto: string
  firmadoPor: string
}

