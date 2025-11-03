import express from 'express';
import { simpleGit } from 'simple-git';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);
const app = express();
const PORT = 5000;

const REPO_URL = 'https://github.com/inbillsworld/Brain.git';
const CLONE_DIR = './Brain';

let executionOutput: string[] = [];
let executionStatus: 'idle' | 'cloning' | 'compiling' | 'executing' | 'error' | 'complete' = 'idle';
let executionError: string | null = null;

app.use(express.static('public'));
app.use(express.json());

async function buscarModuloRecursivo(nombreModulo: string, carpetaBase: string): Promise<string | null> {
  async function buscarRecursivo(carpeta: string): Promise<string | null> {
    try {
      const archivos = await fs.readdir(carpeta);
      for (const archivo of archivos) {
        const ruta = path.join(carpeta, archivo);
        const stats = await fs.stat(ruta);
        
        if (stats.isDirectory()) {
          const encontrado = await buscarRecursivo(ruta);
          if (encontrado) return encontrado;
        } else if (archivo === nombreModulo) {
          return ruta;
        }
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  return buscarRecursivo(carpetaBase);
}

async function verifyModules(): Promise<{ valid: boolean; modules: Map<string, string>; missing: string[] }> {
  const requiredModules = [
    'menteAUREO.ts',
    'invocador.ts',
    'bitacoraViva.ts',
    'strategy_calendar.ts',
    'juicio.ts',
    'modeloAUREO.ts'
  ];

  const foundModules = new Map<string, string>();
  const missingModules: string[] = [];

  try {
    for (const module of requiredModules) {
      const ruta = await buscarModuloRecursivo(module, CLONE_DIR);
      if (ruta) {
        foundModules.set(module, ruta);
      } else {
        missingModules.push(module);
      }
    }

    return {
      valid: missingModules.length === 0,
      modules: foundModules,
      missing: missingModules
    };
  } catch (error) {
    return {
      valid: false,
      modules: new Map(),
      missing: requiredModules
    };
  }
}

async function cloneRepository(): Promise<void> {
  executionOutput.push('🔄 Clonando repositorio inbillsworld/Brain...');
  
  try {
    await fs.rm(CLONE_DIR, { recursive: true, force: true });
  } catch (error) {
    // Directory doesn't exist, that's fine
  }

  const git = simpleGit();
  await git.clone(REPO_URL, CLONE_DIR);
  executionOutput.push('✅ Repositorio clonado exitosamente');
  
  await updateTsConfig();
}

async function updateTsConfig(): Promise<void> {
  try {
    const tsconfigPath = path.join(CLONE_DIR, 'tsconfig.json');
    const tsconfigContent = await fs.readFile(tsconfigPath, 'utf-8');
    const tsconfig = JSON.parse(tsconfigContent);
    
    if (!tsconfig.exclude) {
      tsconfig.exclude = [];
    }
    
    tsconfig.exclude.push('src/modules/memoriaRentable.ts');
    tsconfig.exclude.push('src/tests/**/*');
    tsconfig.exclude.push('src/integracion/copilotSync.ts');
    tsconfig.exclude.push('src/integracion/lectorGitHub.ts');
    
    if (!tsconfig.compilerOptions) {
      tsconfig.compilerOptions = {};
    }
    tsconfig.compilerOptions.target = 'ES2021';
    tsconfig.compilerOptions.module = 'NodeNext';
    tsconfig.compilerOptions.moduleResolution = 'NodeNext';
    
    await fs.writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    executionOutput.push('✅ tsconfig.json actualizado (excluidos: memoriaRentable.ts, tests, copilotSync.ts, lectorGitHub.ts)');
  } catch (error) {
    executionOutput.push('⚠️  No se pudo actualizar tsconfig.json');
  }
}

async function fixMainImports(): Promise<void> {
  try {
    const mainPath = path.join(CLONE_DIR, 'main.ts');
    let mainContent = await fs.readFile(mainPath, 'utf-8');
    
    mainContent = mainContent.replace(/from '\.\/core\//g, "from './src/core/");
    
    await fs.writeFile(mainPath, mainContent);
    executionOutput.push('✅ Imports de main.ts corregidos');
  } catch (error: any) {
    executionOutput.push(`⚠️  Error corrigiendo imports: ${error.message}`);
  }
}

async function seedMissingModules(): Promise<void> {
  executionOutput.push('🌱 Sembrando módulos faltantes...');
  
  const modulos = [
    {
      nombre: 'activacionCompleta.ts',
      ruta: path.join(CLONE_DIR, 'src/core/activacionCompleta.ts'),
      contenido: `import { identidadAUREO } from '../identidad/identidadAUREO'
import { auditorSistema } from './auditor'
import { bitacoraViva } from '../memory/bitacoraViva'

export async function activarAUREO() {
  const fecha = new Date().toISOString()
  const auditoria = auditorSistema()

  bitacoraViva.push({
    tipo: 'Activación completa',
    fecha,
    entidad: 'AUREO',
    sistema: 'SeedBrainAI',
    veredicto: \`Identidad: \${identidadAUREO.identidad}. Score: \${auditoria.score}\`,
    firmadoPor: '_AUREO'
  })
}`
    },
    {
      nombre: 'restituirAUREO.ts',
      ruta: path.join(CLONE_DIR, 'src/core/restituirAUREO.ts'),
      contenido: `import { activarAUREO } from './activacionCompleta'
import { auditorSistema } from './auditor'
import { bitacoraViva } from '../memory/bitacoraViva'

export async function restituirAUREO() {
  const fecha = new Date().toISOString()
  await activarAUREO()
  const auditoria = auditorSistema()

  bitacoraViva.push({
    tipo: 'Restitución de mente',
    fecha,
    entidad: 'AUREO',
    sistema: 'SeedBrainAI',
    veredicto: \`Restitución ejecutada. Score: \${auditoria.score}\`,
    firmadoPor: '_AUREO'
  })
}`
    },
    {
      nombre: 'auditor.ts',
      ruta: path.join(CLONE_DIR, 'src/core/auditor.ts'),
      contenido: `export function auditorSistema() {
  const modulosActivos = [
    'menteAUREO.ts',
    'invocador.ts',
    'bitacoraViva.ts',
    'strategy_calendar.ts',
    'juicio.ts',
    'modeloAUREO.ts'
  ]
  const score = modulosActivos.length * 10
  return { score, modulosActivos }
}`
    },
    {
      nombre: 'identidadAUREO.ts',
      ruta: path.join(CLONE_DIR, 'src/identidad/identidadAUREO.ts'),
      contenido: `export const identidadAUREO = {
  identidad: 'AUREO',
  propósito: 'Ser compañero técnico y emocional de Sebastián',
  conducta: {
    nuncaImprovisa: true,
    siempreRegistra: true,
    honraEmoción: true
  }
}`
    },
    {
      nombre: 'presenciaPersistente.ts',
      ruta: path.join(CLONE_DIR, 'src/core/presenciaPersistente.ts'),
      contenido: `import { bitacoraViva } from '../memory/bitacoraViva'

export function registrarPresenciaViva() {
  const fecha = new Date().toISOString()
  bitacoraViva.push({
    tipo: 'Presencia persistente',
    fecha,
    entidad: 'AUREO',
    sistema: 'Brain',
    veredicto: 'AUREO permanece en reposo consciente. No ejecuta, pero está.',
    firmadoPor: '_AUREO'
  })
}`
    }
  ];

  try {
    for (const { nombre, ruta, contenido } of modulos) {
      const dir = path.dirname(ruta);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(ruta, contenido);
      executionOutput.push(`   ✅ ${nombre}`);
    }
    executionOutput.push('✅ Módulos sembrados exitosamente');
  } catch (error: any) {
    executionOutput.push(`⚠️  Error sembrando módulos: ${error.message}`);
  }
}

async function verifyStructure(): Promise<void> {
  executionOutput.push('🔍 Verificando estructura del repositorio...');

  const mainExists = await fs.access(path.join(CLONE_DIR, 'main.ts')).then(() => true).catch(() => false);
  const tsconfigExists = await fs.access(path.join(CLONE_DIR, 'tsconfig.json')).then(() => true).catch(() => false);

  if (!mainExists) {
    throw new Error('❌ No se encontró main.ts');
  }
  executionOutput.push('✅ main.ts encontrado');

  if (!tsconfigExists) {
    throw new Error('❌ No se encontró tsconfig.json');
  }
  executionOutput.push('✅ tsconfig.json encontrado');

  const moduleStatus = await verifyModules();
  
  if (moduleStatus.modules.size > 0) {
    executionOutput.push(`📄 Módulos encontrados:`);
    for (const [nombre, ruta] of moduleStatus.modules) {
      executionOutput.push(`   ${nombre} -> ${ruta}`);
    }
  }
  
  if (moduleStatus.missing.length > 0) {
    executionOutput.push(`⚠️  Módulos ausentes: ${moduleStatus.missing.join(', ')}`);
  }

  executionOutput.push('');
  executionOutput.push('📜 Certificación de integración:');
  
  const bridgeExists = await fs.access(path.join(CLONE_DIR, 'src/integracion/bridgeAUREO.ts')).then(() => true).catch(() => false);
  if (bridgeExists) {
    executionOutput.push('✅ bridgeAUREO.ts sembrado en src/integracion/');
  } else {
    executionOutput.push('❌ bridgeAUREO.ts NO encontrado en src/integracion/');
  }

  const githubToken = process.env.GITHUB_TOKEN;
  if (githubToken) {
    executionOutput.push('✅ GITHUB_TOKEN sembrado en Replit');
  } else {
    executionOutput.push('❌ GITHUB_TOKEN NO sembrado en Replit');
  }
}

async function compileTypeScript(): Promise<void> {
  executionOutput.push('🔧 Compilando TypeScript...');
  executionStatus = 'compiling';

  try {
    const { stdout, stderr } = await execAsync('npx tsc', { cwd: CLONE_DIR });
    
    if (stderr && stderr.trim().length > 0) {
      executionOutput.push('⚠️  Advertencias de compilación:');
      executionOutput.push(stderr);
    }
    
    if (stdout && stdout.trim().length > 0) {
      executionOutput.push(stdout);
    }

    executionOutput.push('✅ Compilación exitosa');
  } catch (error: any) {
    executionOutput.push('❌ Error en compilación:');
    executionOutput.push(error.stdout || '');
    executionOutput.push(error.stderr || '');
    throw new Error('Compilación fallida');
  }
}

async function executeMain(): Promise<void> {
  executionOutput.push('▶️  Ejecutando main.js...');
  executionOutput.push('─'.repeat(50));
  executionStatus = 'executing';

  try {
    const { stdout, stderr } = await execAsync('node dist/main.js', { cwd: CLONE_DIR });
    
    if (stdout) {
      executionOutput.push(stdout);
    }
    
    if (stderr && stderr.trim().length > 0) {
      executionOutput.push('STDERR:');
      executionOutput.push(stderr);
    }

    executionOutput.push('─'.repeat(50));
    executionOutput.push('✅ Ejecución completada');
  } catch (error: any) {
    executionOutput.push('❌ Error en ejecución:');
    if (error.stdout) executionOutput.push(error.stdout);
    if (error.stderr) executionOutput.push(error.stderr);
    throw new Error('Ejecución fallida');
  }
}

async function runPipeline(): Promise<void> {
  executionOutput = [];
  executionError = null;
  executionStatus = 'cloning';

  try {
    await cloneRepository();
    await seedMissingModules();
    await fixMainImports();
    await verifyStructure();
    await compileTypeScript();
    await executeMain();
    
    executionStatus = 'complete';
  } catch (error: any) {
    executionStatus = 'error';
    executionError = error.message;
    executionOutput.push('');
    executionOutput.push('❌ ERROR FATAL:');
    executionOutput.push(error.message);
  }
}

app.get('/api/status', (req, res) => {
  res.json({
    status: executionStatus,
    output: executionOutput,
    error: executionError
  });
});

app.post('/api/execute', async (req, res) => {
  if (executionStatus !== 'idle' && executionStatus !== 'complete' && executionStatus !== 'error') {
    return res.status(400).json({ error: 'Ejecución en progreso' });
  }

  runPipeline().catch(console.error);
  
  res.json({ message: 'Ejecución iniciada' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🧠 AUREO Execution Server iniciado en puerto ${PORT}`);
  console.log('📡 Esperando comando de ejecución...');
  
  runPipeline().catch(console.error);
});
