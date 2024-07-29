import { Command } from 'commander'
import { LoggerService } from '../../../common'
import { daemon } from '../EdgeCommand/DaemonCommand/ServeCommand/daemon'
import { ftp } from '../EdgeCommand/FtpCommand/ServeCommand/ftp'
import { syslog } from '../EdgeCommand/SyslogCommand/ServeCommand/syslog'
import { firewall } from '../FirewallCommand/ServeCommand/firewall/server'

type Options = {
  isolate: boolean
}

export const ServeCommand = () => {
  const cmd = new Command(`serve`)
    .description(`Run the entire PocketHost stack`)
    .option(`--isolate`, `Use Docker for process isolation.`, false)
    .action(async (options: Options) => {
      const logger = LoggerService().create(`ServeCommand`)
      const { dbg, error, info, warn } = logger
      info(`Starting`)

      await syslog()
      await daemon()
      await ftp()
      await firewall()
    })
  return cmd
}
