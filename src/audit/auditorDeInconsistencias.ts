export function detectarInconsistencias(m1: Métrica[], m2: Métrica[]): Inconsistencia[] {
  const inconsistencias: Inconsistencia[] = []

  for (const m of m1) {
    const match = m2.find(x => x.simbolo === m.simbolo)
    if (match && match.valor !== m.valor) {
      inconsistencias.push({
        simbolo: m.simbolo,
        valor1: m.valor,
        valor2: match.valor,
        diferencia: Math.abs(m.valor - match.valor),
        firmadoPor: '_AUREO'
      })
    }
  }

  return inconsistencias
}

type Métrica = {
  simbolo: string
  valor: number
}

type Inconsistencia = {
  simbolo: string
  valor1: number
  valor2: number
  diferencia: number
  firmadoPor: string
}
