import { forEach } from '@s-libs/micro-dash'
import {
  EDGE_APEX_DOMAIN,
  INSTANCE_COLLECTION,
  InstanceFields_WithUser,
  InstanceId,
  LoggerService,
  PH_EDGE_REGION_NAME,
  PocketBase,
  UserFields,
  UserId,
} from '../../../core'

export const mkInstanceCache = (client: PocketBase) => {
  const { dbg, error } = LoggerService().create(`InstanceCache`)

  const byHostName: { [_: InstanceId]: InstanceFields_WithUser | undefined } =
    {}
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

  client
    .collection(`instances`)
    .getFullList<InstanceFields_WithUser>({
      filter: `region = '${PH_EDGE_REGION_NAME()}'`,
      expand: 'uid',
    })
    .then((records) => {
      records.forEach((record) => {
        setItem(record)
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

  function setItem(record: InstanceFields_WithUser) {
    if (record.region !== PH_EDGE_REGION_NAME()) {
      dbg(`Skipping instance ${record.subdomain} (${record.id})`)
      return
    }
    if (record.cname) {
      byHostName[record.cname] = record
    }
    byHostName[`${record.subdomain}.${EDGE_APEX_DOMAIN()}`] = record
    byHostName[`${record.id}.${EDGE_APEX_DOMAIN()}`] = record
    byUid[record.uid] = {
      ...byUid[record.uid],
      [record.id]: record,
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
