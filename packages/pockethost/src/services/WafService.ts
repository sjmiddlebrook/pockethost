import { PH_WAF_CADDY_CONFIG, PH_WAF_ROOT, mkSingleton } from '../../core'
import { GobotService } from './GobotService'

export type Config = {}

export const WafService = mkSingleton(async (config: Partial<Config> = {}) => {
  const caddyfile = PH_WAF_CADDY_CONFIG()

  const { gobot } = GobotService()
  const bot = await gobot(`caddy`, {
    cachePath: PH_WAF_ROOT(`caddy-cache`),
    env: process.env,
  })
  const caddyPath = await bot.getBinaryFilePath()
  await bot.run([`add-package`, `github.com/caddy-dns/cloudflare`])

  const start = () =>
    bot.run(['run', `--watch`, '--config', caddyfile]).catch(console.error)

  return { start }
})
