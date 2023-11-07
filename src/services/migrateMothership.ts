<<<<<<< HEAD:src/services/migrateMothership.ts
import { MOTHERSHIP_NAME, MOTHERSHIP_SEMVER } from '$constants'
import { PocketbaseService } from '$services'
import { LoggerService } from '$shared'

export const migrateMothership = async () => {
  const logger = LoggerService().create(`migrateMothership`)
  const { dbg, error, info, warn } = logger

  const pbService = await PocketbaseService()
  dbg(`Migrating mothership`)
=======
import { DAEMON_PB_SEMVER, PUBLIC_MOTHERSHIP_NAME } from '$constants'
import { pocketbaseService } from '$services'
import { LoggerService } from '@pockethost/common'

const migrateMothership = async () => {
  const logger = LoggerService().create(`migrateMothership`)
  const { dbg, error, info, warn } = logger

  const pbService = await pocketbaseService()
  info(`Migrating mothership`)
>>>>>>> 8c38aa1d (Squashed commit of the following:):packages/daemon/src/services/migrateMothership.ts
  await (
    await pbService.spawn({
      command: 'migrate',
      isMothership: true,
<<<<<<< HEAD:src/services/migrateMothership.ts
      version: MOTHERSHIP_SEMVER(),
      name: MOTHERSHIP_NAME(),
      slug: MOTHERSHIP_NAME(),
    })
  ).exitCode
  dbg(`Migrating done`)
=======
      version: DAEMON_PB_SEMVER,
      name: PUBLIC_MOTHERSHIP_NAME,
      slug: PUBLIC_MOTHERSHIP_NAME,
    })
  ).exitCode
  info(`Migrating done`)
>>>>>>> 8c38aa1d (Squashed commit of the following:):packages/daemon/src/services/migrateMothership.ts
}
