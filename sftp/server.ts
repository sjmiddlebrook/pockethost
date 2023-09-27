import { timingSafeEqual } from 'crypto'
import { readFileSync } from 'fs'

import { Server, utils } from 'ssh2'

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
    hostKeys: [readFileSync('host.key')],
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
            sftp
              .on('OPEN', (reqid, filename, flags, attrs) => {
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
