import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function leerArchivo(path: string): Promise<string> {
  const { data } = await octokit.request('GET /repos/inbillsworld/Brain/contents/' + path, {
    owner: 'inbillsworld',
    repo: 'Brain',
    path
  });

  const contenido = Buffer.from(data.content, 'base64').toString('utf-8');
  return contenido;
}
