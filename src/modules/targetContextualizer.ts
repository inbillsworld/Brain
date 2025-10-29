import { contextForecaster } from './contextForecaster'

export function targetContextualizer(): string {
  const contexto = contextForecaster()
  if (contexto.volatilidad === 'alta' && contexto.conviccion > 0.8) {
    return 'evitar entrada'
  }
  if (contexto.tendencia === 'alcista' && contexto.conviccion > 0.6) {
    return 'evaluar entrada'
  }
  return 'mantener observación'
}
