import versions from '$src/services/PocketBaseService/versions.cjs'
import { maxSatisfying } from 'semver'

let maxVersion = versions[0]!

export const getLatestVersion = () => maxVersion

export const getVersion = (semVer = maxVersion) => {
  const version = maxSatisfying(versions, semVer)
  if (!version)
    throw new Error(`No version satisfies ${semVer} (${versions.join(', ')})`)
  return version
}
