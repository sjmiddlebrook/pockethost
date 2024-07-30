import { PH_WAF_CADDY_CONFIG, mkSingleton } from '../../../../../../core'
import { GobotService } from '../../../../../services/GobotService'

export type Config = {}

export const WafService = mkSingleton(async (config: Partial<Config> = {}) => {
  const caddyfile = PH_WAF_CADDY_CONFIG()

  const { gobot } = GobotService()
  const bot = await gobot(`caddy`, {
    env: process.env,
  })
  const caddyPath = await bot.getBinaryFilePath()
  await bot.run([`add-package`, `github.com/caddy-dns/cloudflare`])

  const start = () =>
    bot.run(['run', `--watch`, '--config', caddyfile]).catch(console.error)

  return { start }
})
