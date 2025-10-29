export function evaluadorDeEstilo(texto: string): 'institucional' | 'informal' | 'ambiguo' {
  if (texto.includes('veredicto') || texto.includes('firmadoPor')) return 'institucional'
  if (texto.includes('che') || texto.includes('no sé')) return 'informal'
  return 'ambiguo'
}
