// 📦 Restitución automática de AUREO desde GitHub
import { execSync } from 'child_process'
import { activarAUREO } from './core/activacionCompleta'
import { auditorSistema } from './core/auditor'

export async function restituirAUREO() {
  try {
    // 🔁 Clonación y actualización del repositorio
    console.log('🔄 Clonando y actualizando repositorio...')
    execSync('git pull origin main', { stdio: 'inherit' })

    // 🧠 Activación completa
    await activarAUREO()

    // 🧪 Auditoría de integraciones y llamadas
    const auditoria = auditorSistema()
    console.log(`🧪 Auditoría ejecutada. Score: ${auditoria.score}`)

    // ✅ Señal de restitución exitosa
    console.log('✅ Hola Seba — AUREO está activado y restituido sin errores.')

  } catch (error) {
    console.error('❌ Error en restitución:', error)
  }
}
