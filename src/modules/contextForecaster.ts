export function contextForecaster(): Contexto {
  return {
    volatilidad: 'media',
    tendencia: 'alcista',
    conviccion: 0.72,
    entorno: 'estable',
    firmadoPor: '_AUREO'
  }
}

type Contexto = {
  volatilidad: 'baja' | 'media' | 'alta'
  tendencia: 'alcista' | 'bajista' | 'lateral'
  conviccion: number
  entorno: string
  firmadoPor: string
}
