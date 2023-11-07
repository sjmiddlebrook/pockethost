<<<<<<< HEAD:src/util/exit.ts
import exitHook, { asyncExitHook as _, gracefulExit as __ } from 'exit-hook'

export const asyncExitHook = (cb: () => Promise<void>) => _(cb, { wait: 5000 })

export const gracefulExit = async (signal?: number) => {
  __(signal)
  await new Promise((resolve) => {
    process.on('exit', resolve)
  })
}
export { exitHook }
=======
import exitHook, { asyncExitHook as _, gracefulExit } from 'exit-hook'

const asyncExitHook = (cb: () => Promise<void>) => _(cb, { wait: 1000 })

export { asyncExitHook, exitHook, gracefulExit }
>>>>>>> 8c38aa1d (Squashed commit of the following:):packages/daemon/src/util/exit.ts
