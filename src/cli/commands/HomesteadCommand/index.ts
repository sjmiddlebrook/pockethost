import { LoggerService } from '$shared'
import { Command } from 'commander'
import { daemon } from '../EdgeCommand/DaemonCommand/ServeCommand/daemon'
import { syslog } from '../EdgeCommand/EdgeSyslogCommand/ServeCommand/syslog'
import { proxy } from '../FirewallCommand/proxy/server'
import { mothership } from '../MothershipCommand/ServeCommand/mothership'

type Options = {
  debug: boolean
}

export const HomesteadCommand = () => {
  const cmd = new Command(`homestead`)
    .description(`Run the pockethost server in homestead mode`)
    .action(async (options: Options) => {
      const logger = LoggerService().create(`HomesteadCommand`)
      const { dbg, error, info, warn } = logger
      info(`Starting`)

      await syslog()
      await mothership()
      await daemon()
      await proxy()
    })
  return cmd
}
