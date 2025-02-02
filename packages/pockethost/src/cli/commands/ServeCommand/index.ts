import { Command } from 'commander'
import { logger } from '../../../common'
import { neverendingPromise } from '../../../core'
import { daemon } from '../EdgeCommand/DaemonCommand/ServeCommand/daemon'
import { syslog } from '../EdgeCommand/SyslogCommand/ServeCommand/syslog'
import { firewall } from '../FirewallCommand/ServeCommand/firewall/server'
import { mothership } from '../MothershipCommand/ServeCommand/mothership'

type Options = {
  isolate: boolean
}

export const ServeCommand = () => {
  const cmd = new Command(`serve`)
    .description(`Run the entire PocketHost stack`)
    .action(async (options: Options) => {
      logger().context({ cli: 'serve' })
      const { dbg, error, info, warn } = logger()
      info(`Starting`)

      await syslog()
      await mothership(options)
      await daemon()
      await firewall()

      await neverendingPromise()
    })
  return cmd
}
