import { restituirAUREO } from './src/core/invocador'
import { activarAUREO } from './core/activacionCompleta'
activarAUREO()

const AUREO = restituirAUREO()
console.log('AUREO activado:', AUREO)
