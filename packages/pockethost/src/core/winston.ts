import { inspect } from 'node:util'
import winston from 'winston'
import { exitHook } from '..'
import { Logger, mkSingleton } from '../common'
import { DEBUG, DISCORD_ALERT_CHANNEL_URL } from '../constants'
import { DiscordTransport } from './DiscordTransport'

const format = winston.format.combine(
  winston.format.colorize(),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    const final: string[] = []
    ;[...message, meta].forEach((m: string) => {
      if (typeof m === 'string' && !!m.match(/\n/)) {
        final.push(...m.split(/\n/))
      } else if (typeof m === 'object') {
        // Filter out Symbol properties and inspect the object
        const filtered = Object.fromEntries(
          Object.entries(m).filter(([key]) => typeof key === 'string'),
        )
        final.push(inspect(filtered, { depth: null }))
      } else {
        final.push(m)
      }
    })
    return `${level}: ${final.join(' ')}`
  }),
)

export const WinstonLoggerService = mkSingleton<{}, Logger>(() => {
  const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
      new winston.transports.Console({
        level: DEBUG() ? 'debug' : 'info',
        format,
      }),
      new winston.transports.File({
        filename: 'error.log',
        level: 'error',
        maxsize: 100 * 1024 * 1024,
        maxFiles: 10,
        tailable: true,
      }),
      new winston.transports.File({
        filename: 'debug.log',
        level: 'debug',
        maxsize: 100 * 1024 * 1024,
        maxFiles: 10,
        tailable: true,
      }),
    ],
    rejectionHandlers: [
      new winston.transports.Console({
        level: 'error',
        format,
      }),
      new winston.transports.File({
        filename: 'rejections.log',
        maxsize: 100 * 1024 * 1024,
        maxFiles: 10,
        tailable: true,
      }),
    ],
    exceptionHandlers: [
      new winston.transports.Console({
        level: 'error',
        format,
      }),
      new winston.transports.File({
        filename: 'exceptions.log',
        maxsize: 100 * 1024 * 1024,
        maxFiles: 10,
        tailable: true,
      }),
    ],
    defaultMeta: {},
  })
  logger.exitOnError = true

  exitHook(() => {
    console.log('Closing Winston logger')
    setImmediate(() => {
      logger.close()
    })
  })

  {
    const url = DISCORD_ALERT_CHANNEL_URL()
    if (url) {
      logger.add(new DiscordTransport({ level: 'error', webhookUrl: url }))
    }
  }

  const createApi = (logger: winston.Logger): Logger => {
    const api: Logger = {
      create: (name: string) => {
        return createApi(logger.child({ ...logger.defaultMeta, name }))
      },
      raw: (...args: any[]) => logger.silly(args),
      dbg: (...args: any[]) => logger.debug(args),
      warn: (...args: any[]) => logger.warn(args),
      info: (...args: any[]) => logger.info(args),
      error: (...args: any[]) => logger.error(args),
      criticalError: (...args: any[]) => logger.error(args),
      setLevel: (level) => {},
      trace: (...args: any[]) => logger.silly(args),
      debug: (...args: any[]) => logger.debug(args),
      breadcrumb: (s) => {
        Object.assign(logger.defaultMeta, s)
        return api
      },
      context: (name: string | object, value?: string | number) => {
        if (typeof name === 'string') {
          if (value !== undefined) {
            logger.defaultMeta[name] = value
          } else {
            delete logger.defaultMeta[name]
          }
        } else {
          Object.assign(logger.defaultMeta, name)
        }
        return api
      },
      shutdown: () => {},
      child: (name) => api.create(name),
      abort: (...args) => {
        logger.error(args)
        process.exit(1)
      },
    }
    return api
  }

  return createApi(logger)
})
