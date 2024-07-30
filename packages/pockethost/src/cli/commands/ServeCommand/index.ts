import { Command } from 'commander'
import { LoggerService } from '../../../common'
import { daemon } from '../EdgeCommand/DaemonCommand/ServeCommand/daemon'
import { ftp } from '../EdgeCommand/FtpCommand/ServeCommand/ftp'
import { syslog } from '../EdgeCommand/SyslogCommand/ServeCommand/syslog'
import { firewall } from '../FirewallCommand/ServeCommand/firewall/server'

type Options = {}

export const ServeCommand = () => {
  const cmd = new Command(`serve`)
    .description(`Run the entire PocketHost stack`)
    .action(async (options: Options) => {
      const logger = LoggerService().create(`ServeCommand`)
      const { dbg, error, info, warn } = logger
      info(`Starting`)

      await firewall()
      await syslog()
      await ftp()
      await daemon()
    })
  return cmd
}
