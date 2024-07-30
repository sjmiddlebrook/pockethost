import express from 'express'
import { LoggerService } from '../../../../../common'
import { MothershipAdminClientService } from '../../../../../services'
import { InstanceMirror } from './InstanceMirror'
import { PH_EDGE_CACHE_PORT } from './constants.ts'

export async function startInstanceMirrorServer() {
  const logger = LoggerService().create(`EdgeCacheServeCommand`)
  const { dbg, error, info, warn } = logger
  info(`Starting`)

  await MothershipAdminClientService({})
  const cache = await InstanceMirror({})

  const app = express()

  app.get(`/getItem/:host`, (req, res) => {
    const { host } = req.params
    const cached = cache.getItem(host)
    if (!cached) {
      info(`Cache miss for ${host}`)
      return res.status(404).json(null)
    }
    res.json(cached)
  })

  app.listen(PH_EDGE_CACHE_PORT(), () => {
    info(`Listening on port ${PH_EDGE_CACHE_PORT()}`)
  })
}
