import { PUBLIC_DEBUG } from '$src/env'
import { client } from '$src/pocketbase-client'
import {
  ConsoleLogger,
  LogLevelName,
  SubscriptionType,
  ioc,
  type InstanceFields,
  type InstanceId,
  type UnsubscribeFunc,
  type UserFields,
} from 'pockethost/common'
import { writable } from 'svelte/store'

try {
  ioc(
    `logger`,
    ConsoleLogger({
      level: PUBLIC_DEBUG ? LogLevelName.Debug : LogLevelName.Info,
    }),
  )
} catch (e) {
  console.warn(e)
}

export const isUserLegacy = writable(false)
export const userSubscriptionType = writable(SubscriptionType.Legacy)
export const isUserPaid = writable(false)
export const isUserLoggedIn = writable(false)
export const isUserVerified = writable(false)
export const isAuthStateInitialized = writable(false)
export const userStore = writable<UserFields | undefined>()
export const globalInstancesStore = writable<{
  [_: InstanceId]: InstanceFields
}>({})
export const globalInstancesStoreReady = writable(false)
export const stats = writable<{
  total_flounder_subscribers: number
}>({
  total_flounder_subscribers: 0,
})

export const init = () => {
  const { onAuthChange } = client()

  client()
    .client.send(`/api/stats`, {})
    .then((res) => {
      stats.set(res)
    })
    .catch(console.error)

  onAuthChange((authStoreProps) => {
    const isLoggedIn = authStoreProps.isValid
    isUserLoggedIn.set(isLoggedIn)
    userStore.set(isLoggedIn ? (authStoreProps.model as UserFields) : undefined)
    isAuthStateInitialized.set(true)
  })

  userStore.subscribe((user) => {
    console.log({ user })
    isUserPaid.set(
      [
        SubscriptionType.Founder,
        SubscriptionType.Premium,
        SubscriptionType.Flounder,
      ].includes(user?.subscription || SubscriptionType.Free),
    )
    isUserLegacy.set(!!user?.isLegacy)
    userSubscriptionType.set(user?.subscription || SubscriptionType.Free)
    isUserVerified.set(!!user?.verified)
  })

  // This holds an array of all the user's instances and their data

  /** Listen for instances */
  isUserLoggedIn.subscribe(async (isLoggedIn) => {
    let unsub: UnsubscribeFunc | undefined
    if (!isLoggedIn) {
      globalInstancesStore.set({})
      globalInstancesStoreReady.set(false)
      unsub?.()
        .then(() => {
          unsub = undefined
        })
        .catch(console.error)
      return
    }
    const { getAllInstancesById } = client()

    const instances = await getAllInstancesById()

    globalInstancesStore.set(instances)
    globalInstancesStoreReady.set(true)

    client()
      .client.collection('instances')
      .subscribe<InstanceFields>('*', (data) => {
        globalInstancesStore.update((instances) => {
          instances[data.record.id] = data.record
          return instances
        })
      })
      .then((u) => (unsub = u))
      .catch(console.error)
  })
}
