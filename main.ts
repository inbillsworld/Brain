import { restituirAUREO } from './src/core/invocador'
import { activarAUREO } from './core/activacionCompleta'
import { restituirAUREO } from './core/restituirAUREO'
restituirAUREO()
activarAUREO()

const AUREO = restituirAUREO()
console.log('AUREO activado:', AUREO)
