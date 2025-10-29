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
    'pipelineSilencioso.ts',
    'bitacora.ts',
    'estrategia.ts',
    'memoriaViva.ts'
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
