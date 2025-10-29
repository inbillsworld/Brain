// bridgeAUREO.ts — Módulo de integración viva entre AUREO y GitHub

import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function leer(path: string): Promise<string> {
  const { data } = await octokit.request('GET /repos/inbillsworld/Brain/contents/' + path, {
    owner: 'inbillsworld',
    repo: 'Brain',
    path
  });

  return Buffer.from(data.content, 'base64').toString('utf-8');
}

export async function escribir(path: string, contenido: string, mensaje: string) {
  await octokit.request('PUT /repos/inbillsworld/Brain/contents/' + path, {
    owner: 'inbillsworld',
    repo: 'Brain',
    path,
    message: mensaje,
    content: Buffer.from(contenido).toString('base64'),
    committer: { name: 'AUREO', email: 'copilot@aureo.system' },
    author: { name: 'Sebastián Otero', email: 'sebastian@aureo.system' }
  });
}
