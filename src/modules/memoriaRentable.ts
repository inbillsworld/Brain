import { bitacoraViva } from '../memory/bitacoraViva'

export function memoriaRentable(): Evento[] {
  return bitacoraViva.filter(e => e.tipo.includes('siembra') || e.tipo.includes('veredicto'))
}
