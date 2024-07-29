import { forEach } from '@s-libs/micro-dash'
import {
  EDGE_APEX_DOMAIN,
  INSTANCE_COLLECTION,
  InstanceFields_WithUser,
  InstanceId,
  LoggerService,
  PocketBase,
  UserFields,
  UserId,
  stringify,
} from '../../../core'

export const mkInstanceCache = (client: PocketBase) => {
  const { dbg, error } = LoggerService().create(`InstanceCache`)

  const byInstanceId: { [_: InstanceId]: InstanceFields_WithUser | undefined } =
    {}
  const byUid: {
    [_: UserId]: { [_: InstanceId]: InstanceFields_WithUser }
  } = {}

  client
    .collection(`users`)
    .subscribe<UserFields>(`*`, (e) => {
      const { action, record } = e
      if ([`create`, `update`].includes(action)) {
        dbg({ action, record })
        updateUser(record)
      }
    })
    .catch((e) => {
      error(`Failed to subscribe to users`, e, stringify(e, null, 2))
      console.log(e)
    })

  client
    .collection(INSTANCE_COLLECTION)
    .subscribe<InstanceFields_WithUser>(
      `*`,
      (e) => {
        const { action, record } = e
        if ([`create`, `update`].includes(action)) {
          setItem(record)
          dbg({ action, record })
        }
      },
      { expand: 'uid' },
    )
    .catch((e) => {
      error(`Failed to subscribe to instances`, e, stringify(e, null, 2))
    })

  function blankItem(host: string) {
    byInstanceId[host] = undefined
  }

  function updateUser(record: UserFields) {
    forEach(byUid[record.id], (extendedInstance) => {
      extendedInstance.expand.uid = record
    })
  }

  function setItem(record: InstanceFields_WithUser) {
    if (record.cname) {
      byInstanceId[record.cname] = record
    }
    byInstanceId[`${record.subdomain}.${EDGE_APEX_DOMAIN()}`] = record
    byInstanceId[`${record.id}.${EDGE_APEX_DOMAIN()}`] = record
    byUid[record.uid] = {
      ...byUid[record.uid],
      [record.id]: record,
    }
    updateUser(record.expand.uid)
  }

  function getItem(host: string) {
    return byInstanceId[host]
  }

  function hasItem(host: string) {
    return host in byInstanceId
  }

  return { setItem, getItem, blankItem, hasItem }
}
