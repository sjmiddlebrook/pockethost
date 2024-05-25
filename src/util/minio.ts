// ./mc alias set myminio http://localhost:9000 minioadmin minioadmin

import { exec } from 'child_process'
import { Client as MinioClient } from 'minio'
import { promisify } from 'util'

const execAsync = promisify(exec)

const MINIO_ALIAS = 'myminio'

const minioClient = new MinioClient({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin',
})

async function createBucketIfNotExists(bucketName: string) {
  const exists = await minioClient.bucketExists(bucketName)
  if (exists) return
  await minioClient.makeBucket(bucketName, 'us-east-1')
  console.log(`Bucket ${bucketName} created`)
  await setBucketQuota(bucketName, '1G')
}

async function setBucketQuota(bucketName: string, quota: string) {
  await execAsync(
    `mc admin bucket quota ${MINIO_ALIAS}/${bucketName} --hard ${quota}`,
  )
  console.log(`Bucket ${bucketName} quota set to ${quota}`)
}

async function createUserIfNotExists(id: string) {
  try {
    const { stdout } = await execAsync(
      `mc admin user info ${MINIO_ALIAS} ${id}`,
    )
    if (stdout.includes(id)) return
    await execAsync(`mc admin user add ${MINIO_ALIAS} ${id} ${id} ${id}`)
    console.log(`User ${id} created`)
  } catch (error) {
    console.error('Failed to create user:', error)
  }
}

async function ensureMinio(id: string) {
  await createUserIfNotExists(id)
  await createBucketIfNotExists('backups')
  await createBucketIfNotExists('storage')
}

export { ensureMinio }
