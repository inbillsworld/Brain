// Módulo de sincronización manual entre AUREO y el repositorio sembrado
// No usa Octokit. Genera archivos locales para commit manual.

import { Evento } from '../tipos';

export function generarArchivoEvento(evento: Evento): string {
  const fecha = new Date().toISOString().split('T')[0];
  const nombreArchivo = `eventos/evento_${fecha}_${evento.tipo}.ts`;

  const contenido = `// Evento registrado por AUREO\nexport const evento = ${JSON.stringify(evento, null, 2)};`;

  return `\n// Copiá este contenido en: ${nombreArchivo}\n\n${contenido}`;
}

