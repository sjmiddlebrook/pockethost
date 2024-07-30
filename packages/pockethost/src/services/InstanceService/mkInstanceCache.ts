import { forEach } from '@s-libs/micro-dash'
import {
  INSTANCE_COLLECTION,
  InstanceFields_WithUser,
  InstanceId,
  LoggerService,
  PocketBase,
  UserFields,
  UserId,
  mkInstanceCanonicalHostname,
  mkInstanceHostname,
} from '../../../core'

export const mkInstanceCache = async (client: PocketBase) => {
  const { dbg, error } = LoggerService().create(`InstanceCache`)

  const cleanupById: { [_: InstanceId]: () => void } = {}
  const byId: { [_: InstanceId]: InstanceFields_WithUser | undefined } = {}
  const byHostName: { [_: string]: InstanceFields_WithUser | undefined } = {}
  const byUid: {
    [_: UserId]: { [_: InstanceId]: InstanceFields_WithUser }
  } = {}

  client
    .collection(`users`)
    .subscribe<UserFields>(`*`, (e) => {
      const { action, record } = e
      if ([`create`, `update`].includes(action)) {
        if (!(record.id in byUid)) return
        updateUser(record)
      }
    })
    .catch((e) => {
      error(`Failed to subscribe to users`, e)
    })

  client
    .collection(INSTANCE_COLLECTION)
    .subscribe<InstanceFields_WithUser>(
      `*`,
      (e) => {
        const { action, record } = e
        if ([`create`, `update`].includes(action)) {
          setItem(record)
        }
      },
      { expand: 'uid' },
    )
    .catch((e) => {
      error(`Failed to subscribe to instances`, e)
    })

  await client
    .collection(`instances`)
    .getFullList<InstanceFields_WithUser>({
      expand: 'uid',
    })
    .then((records) => {
      records.forEach((record) => {
        setItem(record, true)
      })
    })
    .catch((e) => error(`Failed to get instances`, e))

  function blankItem(host: string) {
    byHostName[host] = undefined
  }

  function updateUser(record: UserFields) {
    dbg(`Updating user ${record.email} (${record.id})`)
    forEach(byUid[record.id], (extendedInstance) => {
      extendedInstance.expand.uid = record
    })
  }

  function setItem(record: InstanceFields_WithUser, safe = false) {
    if (safe && byId[record.id]) {
      dbg(`Skipping instance update ${record.subdomain} (${record.id})`)
      return
    }
    cleanupById[record.id]?.()
    byId[record.id] = record
    if (record.cname) {
      byHostName[record.cname] = record
    }
    byHostName[mkInstanceHostname(record)] = record
    byHostName[mkInstanceCanonicalHostname(record)] = record
    byUid[record.uid] = {
      ...byUid[record.uid],
      [record.id]: record,
    }
    cleanupById[record.id] = () => {
      dbg(`Cleaning up instance ${record.subdomain} (${record.id})`)
      delete byId[record.id]
      delete byHostName[mkInstanceHostname(record)]
      delete byHostName[mkInstanceCanonicalHostname(record)]
      if (record.cname) {
        delete byHostName[record.cname]
      }
    }
    dbg(`Updating instance ${record.subdomain} (${record.id})`)
    updateUser(record.expand.uid)
  }

  function getItem(host: string) {
    return byHostName[host]
  }

  function hasItem(host: string) {
    return host in byHostName
  }

  return { setItem, getItem, blankItem, hasItem }
}
