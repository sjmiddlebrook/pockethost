import 'express-async-errors'
import { LoggerService } from '../../../../../common'
import { WafService } from '../../../../../services/WafService'

export const firewall = async () => {
  const { debug } = LoggerService().create(`proxy`)

  const { start } = await WafService({})

  start()
}
