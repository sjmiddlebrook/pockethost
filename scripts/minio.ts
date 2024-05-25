// import { ensureMinio } from '../src/util/minio'
import { globSync } from 'glob'
import knex from 'knex'

type S3 = {
  enabled: boolean
  bucket: string
  region: string
  endpoint: string
  accessKey: string
  secret: string
  forcePathStyle: boolean
}

async function main() {
  const ids = globSync(`*`, { cwd: `../data` })

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i]
    console.log(`Processing ${id}`)

    const db = knex({
      client: 'sqlite3', // or 'better-sqlite3'
      connection: {
        filename: `../data/${id}/pb_data/data.db`,
      },
      useNullAsDefault: true,
    })
    try {
      const res = await db.raw(`select * from _params where key='settings'`)
      const [{ value }] = res
      const settings = JSON.parse(value)
      if (settings.s3.bucket) {
        console.log(settings.s3)
      }
      if (settings.backups?.s3?.bucket) {
        console.log(settings.backups.s3)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
main()

// const id = process.argv[2]

// console.log({ id })

// ensureMinio(id)
