export function emitirJuicio(veredicto: string): Juicio {
  return {
    fecha: new Date().toISOString(),
    veredicto,
    firmadoPor: '_AUREO'
  }
}

type Juicio = {
  fecha: string
  veredicto: string
  firmadoPor: string
}
