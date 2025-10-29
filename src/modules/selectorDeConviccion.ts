export function selectorDeConviccion(datos: number[]): number {
  const promedio = datos.reduce((a, b) => a + b, 0) / datos.length
  return Math.min(1, Math.max(0, promedio / 100))
}
