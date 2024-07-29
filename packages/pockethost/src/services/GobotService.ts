import { GobotOptions, gobot } from 'gobot'
import { mkSingleton } from '../common'
import { PH_HOME } from '../constants'

export const GobotService = mkSingleton(() => {
  const cachePath = PH_HOME(`gobot`, `cache`)

  return {
    gobot: (name: string, options?: Partial<GobotOptions>) =>
      gobot(name, { ...options, cachePath }),
  }
})
