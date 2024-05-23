import {
  DATA_ROOT,
  DEBUG,
  IS_DEV,
  LS_WEBHOOK_SECRET,
  mkContainerHomePath,
  MOTHERSHIP_APP_DIR,
  MOTHERSHIP_DATA_ROOT,
  MOTHERSHIP_HOOKS_DIR,
  MOTHERSHIP_MIGRATIONS_DIR,
  MOTHERSHIP_NAME,
  MOTHERSHIP_PORT,
  MOTHERSHIP_SEMVER,
} from '$constants'
import { PocketbaseService, PortService, SpawnConfig } from '$services'
import { LoggerService } from '$shared'
import { gracefulExit } from '$util'
import copyfiles from 'copyfiles'
import { gobot, GobotOptions } from 'gobot'
import { rimraf } from 'rimraf'

export type MothershipConfig = { isolate: boolean }

const _copy = (src: string, dst: string) => {
  const { error } = LoggerService().create(`copy`)

  return new Promise<void>((resolve) => {
    copyfiles(
      [src, dst],
      {
        verbose: DEBUG(),
        up: true,
      },
      (err) => {
        if (err) {
          error(err)
          throw err
        }
        resolve()
      },
    )
  })
}

export async function mothership(cfg: MothershipConfig) {
  const { isolate } = cfg
  const logger = LoggerService().create(`Mothership`)
  const { dbg, error, info, warn } = logger
  info(`Starting`)

  dbg(`Isolation mode:`, { isolate })

  await PortService({})

  /** Launch central database */
  info(`Serving`)
  const bot = await gobot(`pocketbase`)
  const env = {
    DATA_ROOT: mkContainerHomePath(`data`),
    LS_WEBHOOK_SECRET: LS_WEBHOOK_SECRET(),
    PB_VERSIONS: await bot.versions('json', true),
  }
  dbg(env)
  if (isolate) {
    const pbService = await PocketbaseService({})
    const cfg: SpawnConfig = {
      version: MOTHERSHIP_SEMVER(),
      subdomain: MOTHERSHIP_NAME(),
      instanceId: MOTHERSHIP_NAME(),
      port: MOTHERSHIP_PORT(),
      dev: DEBUG(),
      env,
      extraBinds: [
        `${DATA_ROOT()}:${mkContainerHomePath(`data`)}`,
        `${MOTHERSHIP_HOOKS_DIR()}:${mkContainerHomePath(`pb_hooks`)}`,
        `${MOTHERSHIP_MIGRATIONS_DIR()}:${mkContainerHomePath(
          `pb_migrations`,
        )}`,
        `${MOTHERSHIP_APP_DIR()}:${mkContainerHomePath(`ph_app`)}`,
      ],
    }
    dbg(`Spawn config`, cfg)
    const { url, exitCode } = await pbService.spawn(cfg)
    info(`Mothership URL for this session is ${url}`)
    exitCode.then((c) => {
      gracefulExit(c)
    })
  } else {
    await rimraf(MOTHERSHIP_DATA_ROOT(`pb_hooks`))
    await _copy(MOTHERSHIP_HOOKS_DIR(`**/*`), MOTHERSHIP_DATA_ROOT(`pb_hooks`))
    await rimraf(MOTHERSHIP_DATA_ROOT(`pb_migrations`))
    await _copy(
      MOTHERSHIP_MIGRATIONS_DIR(`**/*`),
      MOTHERSHIP_DATA_ROOT(`pb_migrations`),
    )
    const args = [
      `serve`,
      `--http`,
      `0.0.0.0:${MOTHERSHIP_PORT()}`,
      `--dir`,
      MOTHERSHIP_DATA_ROOT(`pb_data`),
      `--hooksDir`,
      MOTHERSHIP_DATA_ROOT(`pb_hooks`),
      `--migrationsDir`,
      MOTHERSHIP_DATA_ROOT(`pb_migrations`),
      `--publicDir`,
      MOTHERSHIP_DATA_ROOT(`pb_public`),
    ]
    if (IS_DEV()) {
      args.push(`--dev`)
    }
    const options: Partial<GobotOptions> = {
      version: MOTHERSHIP_SEMVER(),
      env,
    }
    dbg(`args`, args)
    dbg(`options`, options)
    const bot = await gobot(`pocketbase`, options)
    bot.run(args, { env })
  }
}
