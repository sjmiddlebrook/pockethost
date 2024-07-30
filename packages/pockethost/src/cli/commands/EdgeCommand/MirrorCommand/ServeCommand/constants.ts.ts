import { default as env } from 'env-var'
import { join } from 'path'

export const PH_EDGE_CACHE_PORT = () =>
  env.get('PH_EDGE_CACHE_PORT').default(3001).asPortNumber()
export const mkInstanceMirrorUrl = (...paths: string[]) =>
  join(`http://localhost:${PH_EDGE_CACHE_PORT()}`, ...paths)
