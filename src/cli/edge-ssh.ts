import { DEBUG, DefaultSettingsService, SETTINGS } from '$constants'
import { LogLevelName, LoggerService } from '$shared'
import { timingSafeEqual } from 'crypto'
import Docker from 'dockerode'
import { readFileSync } from 'fs'
import { default as ssh2 } from 'ssh2'
import { inspect } from 'util'
import { isNativeError } from 'util/types'

const docker = new Docker()

DefaultSettingsService(SETTINGS)

const { warn, info, dbg, error } = LoggerService({
  level: DEBUG() ? LogLevelName.Debug : LogLevelName.Info,
})

const {
  Server,
  utils: { parseKey },
} = ssh2

const allowedUser = Buffer.from('foo')
const allowedPubKey = parseKey(
  `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDOuCUymRkQB4/PzqSy0vVHI9d4XzczQVmVY3Ia7TQxjUL6qOG37yZxRf1RrhAtpN/M4D1eBenYI6GdSB4hTxB92qgif+LwJEQ53gLql+52t9IIFKJdW29ySL9SIhL3mUGRv3DZIQox0pyVnXFZEO56s0oIPHPqkTOJib0Z3868qcpIV2eEEipAz+rpfQsZtvmQciHS3OKwBOdZ4IgxNF0o4Mx7Oj3h/vi1SjCli5GTFxyjcrh6NLJusiodXY80yVMt4ILW+7JtN9hoYcfDXMlT0KoTcxACqYypbxllBXxqe/QQZWQayZJzz70DzaZN+4w4lJYboB/LUvqn1DDjZpkr pockethost@pockethost`,
)
console.log({ allowedPubKey })

if (isNativeError(allowedPubKey)) {
  throw allowedPubKey
}

function checkValue(input: Buffer, allowed: Buffer) {
  const autoReject = input.length !== allowed.length
  if (autoReject) {
    // Prevent leaking length information by always making a comparison with the
    // same input when lengths don't match what we expect ...
    console.log(input, allowed)
    dbg(`Length reject`, input.length, allowed.length)
    allowed = input
  }
  const isMatch = timingSafeEqual(input, allowed)
  return !autoReject && isMatch
}

new Server(
  {
    hostKeys: [readFileSync(`/home/pockethost/.ssh/id_rsa`)],
  },
  (client) => {
    dbg('Client connected!')

    client
      .on('authentication', (ctx) => {
        const isAllowed = (() => {
          if (!checkValue(Buffer.from(ctx.username), allowedUser)) {
            return false
          }
          switch (ctx.method) {
            case 'password':
              dbg(`password`)
              return false
            case 'publickey':
              dbg(`publickehy`)
              if (ctx.key.algo !== allowedPubKey.type) {
                dbg(
                  `Skipping public key because ${ctx.key.algo} doesn't match ${allowedPubKey.type}`,
                )
                return false
              }
              dbg(`Algo ${ctx.key.algo} passed`)
              if (!checkValue(ctx.key.data, allowedPubKey.getPublicSSH())) {
                dbg(`Value check failed`)
                return false
              }
              dbg(`Value passed`)
              if (ctx.signature) {
                if (
                  allowedPubKey.verify(
                    ctx.blob,
                    ctx.signature,
                    ctx.hashAlgo,
                  ) !== true
                ) {
                  dbg(`Signature verification failed`)
                  return false
                }
                dbg(`Signature verification passed`)
              } else {
                dbg(`Signature verification skipped`)
              }
              return true
            case 'none':
              return false
            default:
              dbg(`Unknown authentication method ${ctx.method}`)
              return false
          }
        })()

        if (!isAllowed) {
          dbg(`Method ${ctx.method} not allowed`)
          ctx.reject()
          return
        }

        dbg(`Method ${ctx.method} is allowed`)
        ctx.accept()
      })
      .on('ready', () => {
        dbg('Client authenticated!')

        client.on('session', (accept, reject) => {
          const session = accept()
          dbg(`Session open`)
          session.on('exec', (accept, reject, info) => {
            console.log('Client wants to execute: ' + inspect(info.command))
            const stream = accept()
            stream.stderr.write('Oh no, the dreaded errors!\n')
            stream.write('Just kidding about the errors!\n')
            stream.exit(0)
            stream.end()
          })
          session.on('pty', (accept, reject, info) => {
            dbg(`PTY requested`)
            accept()
          })
          session.on('shell', async (accept, reject) => {
            dbg(`shell requested`)
            const channel = accept()
            try {
              // Create a Docker container and attach to it
              const container = await docker.createContainer({
                Image: 'pockethost-instance', // replace with your Docker image
                Cmd: ['/bin/bash'], // replace with your command if different
                Tty: true,
                AttachStdin: true,
                AttachStdout: true,
                AttachStderr: true,
                OpenStdin: true,
              })

              await container.start()
              dbg(`Container started`)

              const containerStream = await container.attach({
                stream: true,
                stdin: true,
                stdout: true,
                stderr: true,
              })

              // Pipe SSH stream to Docker container and vice versa
              containerStream.pipe(channel).pipe(containerStream)

              containerStream.write(`\n`)

              channel.on('close', async () => {
                dbg('SSH stream closed')
                containerStream.end()
                try {
                  await container.stop()
                } catch (e) {
                  dbg(`Container already stopped`)
                }
                await container.remove()
              })
            } catch (e) {
              error(`${e}`)
              channel.end()
            }
          })
        })
      })
      .on('close', () => {
        dbg('Client disconnected')
      })
  },
).listen(2222, '127.0.0.1', function () {
  console.log('Listening on port ' + this.address().port)
})
