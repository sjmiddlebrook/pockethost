import { Command } from 'commander'
import { mothership } from './mothership'

type Options = {
  safe: boolean
}

export const ServeCommand = () => {
  const cmd = new Command(`serve`)
    .description(`Run the PocketHost mothership`)
    .option(`--safe`, `Safe mode (no hooks or migrations)`, false)
    .action(async (options: Options) => {
      console.log({ options })
      await mothership(options)
    })
  return cmd
}
