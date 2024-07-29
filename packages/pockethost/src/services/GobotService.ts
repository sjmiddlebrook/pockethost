import { GobotOptions, gobot } from 'gobot'
import { mkSingleton } from '../common'
import { PH_GOBOT_ROOT } from '../constants'

export const GobotService = mkSingleton(() => {
  const cachePath = PH_GOBOT_ROOT(`cache`)

  return {
    gobot: (name: string, options?: Partial<GobotOptions>) =>
      gobot(name, { ...options, cachePath }),
  }
})
