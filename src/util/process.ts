<<<<<<< HEAD:src/util/process.ts
import { ioc } from '$constants'
import { gracefulExit } from './exit'
;['unhandledRejection', 'uncaughtException'].forEach((type) => {
  process.on(type, (e) => {
    console.error(`${e}`)

    const debug = (() => {
      try {
        return ioc.service('settings').DEBUG
      } catch {
        return true
      }
    })()
    if (debug) {
=======
import { PUBLIC_DEBUG } from '$constants'
import { LoggerService } from '@pockethost/common'
import { gracefulExit } from 'exit-hook'
;['unhandledRejection', 'uncaughtException'].forEach((type) => {
  process.on(type, (e) => {
    const { error } = LoggerService().create(type)

    error(`${e}`)

    if (PUBLIC_DEBUG) {
>>>>>>> 8c38aa1d (Squashed commit of the following:):packages/daemon/src/util/process.ts
      console.error(e.stack)
      gracefulExit()
    }
  })
})
