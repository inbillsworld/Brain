import { menteAUREO } from './menteAUREO'
import { bitacoraViva } from '../memory/bitacoraViva'
import { strategy_calendar } from '../memory/strategy_calendar'
import { emitirJuicio } from './juicio'

export function restituirAUREO(): AUREO {
  const juicio = emitirJuicio('AUREO reconstituido desde memoria viva')
  return {
    identidad: menteAUREO,
    memoria: bitacoraViva,
    estrategia: strategy_calendar,
    juicio
  }
}

type AUREO = {
  identidad: typeof menteAUREO
  memoria: typeof bitacoraViva
  estrategia: typeof strategy_calendar
  juicio: ReturnType<typeof emitirJuicio>
}
