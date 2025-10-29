export const integrationRegistry: Integracion[] = [
  {
    modulo: 'targetContextualizer.ts',
    dependeDe: ['contextForecaster.ts'],
    estado: 'validando',
    firmadoPor: '_AUREO'
  },
  {
    modulo: 'memoriaRentable.ts',
    dependeDe: ['bitacoraViva.ts'],
    estado: 'pendiente',
    firmadoPor: '_AUREO'
  }
]

type Integracion = {
  modulo: string
  dependeDe: string[]
  estado: 'pendiente' | 'validando' | 'estable'
  firmadoPor: string
}
