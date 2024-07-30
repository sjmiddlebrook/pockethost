import fetch from 'node-fetch'
import { InstanceFields_WithUser, mkSingleton } from '../../../../../common'
import { mkInstanceMirrorUrl } from './constants.ts'

export const InstanceMirrorClient = mkSingleton(() => {
  const getItem = (host: string) =>
    fetch(mkInstanceMirrorUrl(`getItem`, host)).then(
      (res) => res.json() as Promise<InstanceFields_WithUser | null>,
    )

  const setItem = (record: InstanceFields_WithUser) =>
    fetch(mkInstanceMirrorUrl(`setItem`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record),
    })

  return {
    getItem,
    setItem,
  }
})
