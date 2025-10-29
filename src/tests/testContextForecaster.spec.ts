import { contextForecaster } from '../modules/contextForecaster'

describe('contextForecaster', () => {
  it('debería devolver contexto válido', () => {
    const contexto = contextForecaster()
    expect(contexto).toHaveProperty('volatilidad')
    expect(contexto).toHaveProperty('tendencia')
  })
})
