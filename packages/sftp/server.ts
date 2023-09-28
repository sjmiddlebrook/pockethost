import { timingSafeEqual } from 'crypto'
import { readFileSync } from 'fs'

import { Attributes, Server, utils } from 'ssh2'

const { OPEN_MODE, STATUS_CODE } = utils.sftp

const allowedUser = Buffer.from('foo')
const allowedPassword = Buffer.from('bar')

function checkValue(input, allowed) {
  const autoReject = input.length !== allowed.length
  if (autoReject) {
    // Prevent leaking length information by always making a comparison with the
    // same input when lengths don't match what we expect ...
    allowed = input
  }
  const isMatch = timingSafeEqual(input, allowed)
  return !autoReject && isMatch
}

// This simple SFTP server implements file uploading where the contents get
// ignored ...

new Server(
  {
    hostKeys: [readFileSync('../ssl/pockethost.test.key')],
  },
  (client) => {
    console.log('Client connected!')

    client
      .on('authentication', (ctx) => {
        console.log({ ctx })
        let allowed = true
        if (!checkValue(Buffer.from(ctx.username), allowedUser)) allowed = false

        if (ctx.method !== 'password') {
          return ctx.reject(['password'])
        }
        if (!checkValue(Buffer.from(ctx.password), allowedPassword))
          return ctx.reject()

        if (allowed) ctx.accept()
        else ctx.reject()
      })
      .on('ready', () => {
        console.log('Client authenticated!', client)

        client.on('session', (accept, reject) => {
          const session = accept()
          console.log(JSON.stringify(session, null, 2))

          session.on('sftp', (accept, reject) => {
            console.log('Client SFTP session')
            const openFiles = new Map()
            let handleCount = 0
            const sftp = accept()
            sftp.on('ready', () => {
              console.log(`ready`)
            })
            sftp
              .on(
                `OPEN`,
                (
                  reqId: number,
                  filename: string,
                  flags: number,
                  attrs: Attributes,
                ) => {
                  console.log(`OPEN`)
                },
              )
              .on(
                `READ`,
                (
                  reqId: number,
                  handle: Buffer,
                  offset: number,
                  len: number,
                ) => {
                  console.log(`READ`)
                },
              )
              .on(
                `WRITE`,
                (
                  reqId: number,
                  handle: Buffer,
                  offset: number,
                  data: Buffer,
                ) => {
                  console.log(`WRITE`)
                },
              )
              .on(`FSTAT`, (reqId: number, handle: Buffer) => {
                console.log(`FSTAT`)
              })
              .on(
                `FSETSTAT`,
                (reqId: number, handle: Buffer, attrs: Attributes) => {
                  console.log(`FSETSTAT`)
                },
              )
              .on(`CLOSE`, (reqId: number, handle: Buffer) => {
                console.log(`CLOSE`)
              })
              .on(`OPENDIR`, (reqId: number, path: string) => {
                console.log(`OPENDIR`)
              })
              .on(`READDIR`, (reqId: number, handle: Buffer) => {
                console.log(`READDIR`)
              })
              .on(`LSTAT`, (reqId: number, path: string) => {
                console.log(`LSTAT`)
              })
              .on(`STAT`, (reqId: number, path: string) => {
                console.log(`STAT`)
              })
              .on(`REMOVE`, (reqId: number, path: string) => {
                console.log(`REMOVE`)
              })
              .on(`RMDIR`, (reqId: number, path: string) => {
                console.log(`RMDIR`)
              })
              .on(`REALPATH`, (reqId: number, path: string) => {
                console.log(`REALPATH`)
              })
              .on(`READLINK`, (reqId: number, path: string) => {
                console.log(`READLINK`)
              })
              .on(
                `SETSTAT`,
                (reqId: number, path: string, attrs: Attributes) => {
                  console.log(`SETSTAT`)
                },
              )
              .on(`MKDIR`, (reqId: number, path: string, attrs: Attributes) => {
                console.log(`MKDIR`)
              })
              .on(
                `RENAME`,
                (reqId: number, oldPath: string, newPath: string) => {
                  console.log(`RENAME`)
                },
              )
              .on(
                `SYMLINK`,
                (reqId: number, targetPath: string, linkPath: string) => {
                  console.log(`SYMLINK`)
                },
              )
              .on(
                `EXTENDED`,
                (reqId: number, extName: string, extData: Buffer) => {
                  console.log(`EXTENDED`)
                },
              )
              .on('OPENDIR', () => {
                console.log(`OPENDIR`)
              })
              .on('READDIR', () => {
                console.log(`readdir`)
              })
              .on('OPEN', (reqid, filename, flags, attrs) => {
                console.log(`OPEN`)
                // Only allow opening /tmp/foo.txt for writing
                if (filename !== '/tmp/foo.txt' || !(flags & OPEN_MODE.WRITE))
                  return sftp.status(reqid, STATUS_CODE.FAILURE)

                // Create a fake handle to return to the client, this could easily
                // be a real file descriptor number for example if actually opening
                // a file on disk
                const handle = Buffer.alloc(4)
                openFiles.set(handleCount, true)
                handle.writeUInt32BE(handleCount++, 0)

                console.log('Opening file for write')
                sftp.handle(reqid, handle)
              })
              .on('WRITE', (reqid, handle, offset, data) => {
                console.log(`WRITE`)
                if (
                  handle.length !== 4 ||
                  !openFiles.has(handle.readUInt32BE(0))
                ) {
                  return sftp.status(reqid, STATUS_CODE.FAILURE)
                }

                // Fake the write operation
                sftp.status(reqid, STATUS_CODE.OK)

                console.log(
                  'Write to file at offset ${offset}: ${inspect(data)}',
                )
              })
              .on('CLOSE', (reqid, handle) => {
                console.log(`CLOSE`)
                let fnum
                if (
                  handle.length !== 4 ||
                  !openFiles.has((fnum = handle.readUInt32BE(0)))
                ) {
                  return sftp.status(reqid, STATUS_CODE.FAILURE)
                }

                console.log('Closing file')
                openFiles.delete(fnum)

                sftp.status(reqid, STATUS_CODE.OK)
              })
          })
        })
      })
      .on('close', () => {
        console.log('Client disconnected')
      })
  },
).listen(54191, '127.0.0.1', function () {
  console.log('Listening on port ' + this.address().port)
})
