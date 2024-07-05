import { forEach, keys, omit, uniq } from '@s-libs/micro-dash'
import { DotenvParseOutput, parse } from 'dotenv'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { info } from '../cli'
import { doSettingsFilter } from '../common'
import { PH_HOME, settings } from '../constants'

const envFile = () => {
  const envFile = PH_HOME(`.env`)
  if (!existsSync(envFile)) {
    writeFileSync(envFile, '')
  }
  return envFile
}

const configNameGuard = async (nameIn: string) => {
  const _settings = await doSettingsFilter(settings)
  const name = nameIn.toUpperCase()
  if (!(name in _settings)) {
    throw new Error(`Invalid config name ${nameIn}`)
  }
  return name
}

const _parse = () =>
  parse(readFileSync(envFile(), { encoding: 'utf8' }).toString())

function write(values: DotenvParseOutput) {
  writeFileSync(
    envFile(),
    Object.entries(values)
      .map(([k, v]) => `${k}=${v}`)
      .join('\n'),
  )
  info(`Written to ${envFile()}`)
}

export const setConfig = async (nameIn: string, value: string) => {
  if (value === '=') throw new Error(`Invalid value ${value}`)
  const name = await configNameGuard(nameIn)

  const values = _parse()
  values[name] = value
  info(`Set ${name}=${value}`)
  process.env[name] = value
  write(values)
}

export const unsetConfig = (name: string) => {
  const values = _parse()
  delete values[name]
  delete process.env[name]
  info(`Unset ${name}`)
  write(values)
}

export const listConfig = async () => {
  const values = _parse()

  if (keys(values).length > 0) {
    info()
    info(`Config values from ${envFile()}:`)
    forEach(values, (v, k) => {
      info(`\t${k}=${v}`)
    })
    info()
  } else {
    info(`No config values found in ${envFile()}`)
  }

  const _settings = await doSettingsFilter(settings)
  const defaults = omit(_settings, keys(values) as any)
  if (keys(defaults).length > 0) {
    info(`Default values:`)
    forEach(defaults, (v, k) => {
      if (k in values) return
      info(`\t${k}=${v}`)
    })
  } else {
    info(`No default values because all values are defined in ${envFile()}`)
  }
}

export const appendConfig = async (nameIn: string, value: string) => {
  const name = await configNameGuard(nameIn)
  const values = _parse()
  values[name] = uniq([
    ...(values[name]
      ?.split(/,/)
      .map((v) => v.trim())
      .filter((v) => !!v) || []),
    value,
  ]).join(`,`)
  info(`Added ${value} to ${name}`)
  write(values)
}

export const filterConfig = async (nameIn: string, value: string) => {
  const name = await configNameGuard(nameIn)
  const values = _parse()
  values[name] = uniq([
    ...(values[name]
      ?.split(/,/)
      .map((v) => v.trim())
      .filter((v) => v !== value) || []),
  ]).join(`,`)
  info(`Filtered ${value} from ${name}`)
  write(values)
}
