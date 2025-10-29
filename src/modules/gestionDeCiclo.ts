export function gestionDeCiclo(etapa: string): string {
  switch (etapa) {
    case 'inicio': return 'validar contexto'
    case 'evaluación': return 'ajustar convicción'
    case 'cierre': return 'registrar veredicto'
    default: return 'etapa desconocida'
  }
}
