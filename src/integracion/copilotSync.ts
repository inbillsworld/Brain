import { Octokit } from 'octokit';
import { Evento } from '../tipos';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function registrarEventoGitHub(evento: Evento) {
  const fecha = new Date().toISOString().split('T')[0];
  const nombreArchivo = `eventos/evento_${fecha}_${evento.tipo}.ts`;
  const contenido = `// Evento registrado por AUREO\nexport const evento = ${JSON.stringify(evento, null, 2)};`;

  await octokit.request('PUT /repos/inbillsworld/Brain/contents/' + nombreArchivo, {
    owner: 'inbillsworld',
    repo: 'Brain',
    path: nombreArchivo,
    message: `Registro de evento: ${evento.tipo}`,
    content: Buffer.from(contenido).toString('base64'),
    committer: { name: 'AUREO', email: 'copilot@aureo.system' },
    author: { name: 'Sebastián Otero', email: 'sebastian@aureo.system' }
  });
}
