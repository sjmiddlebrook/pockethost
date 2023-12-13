/// <reference path="../../../types/types.d.ts" />

module.exports = {
  manifeset: {
    name: `Mass Mailer`,
    uuid: `mass-mailer`,
    version: `0.0.1`,
    author: `benallfree`,
  },
  init: () => {
    // prints "Hello!" every 2 minutes
    // cronAdd('plugin-mass-mail', '* * * * *', () => {
    routerAdd('POST', '/api/plugins/mass-mail/process', (c) => {
      console.log('***Hello!')

      const nowIso = () => new Date().toISOString()
      const now = () => +new Date()
      const start = now()

      // TESTING - reset the db
      $app
        .dao()
        .db()
        .newQuery(
          `update plugin_mass_mail_message_queue set status='queued', log='[]'`,
        )
        .execute()

      do {
        // ratelimit
        const next = now() + 100 // 10 emails per second
        while (now() < next) {}

        const queueItem = (() => {
          try {
            const queueItem = new Record()
            $app
              .dao()
              .recordQuery('plugin_mass_mail_message_queue')
              .andWhere($dbx.notIn(`status`, 'sent', 'error'))
              .orderBy('updated ASC')
              .limit(1)
              .one(queueItem)
            return queueItem
          } catch (e) {
            console.log(e)
          }
        })()
        if (!queueItem) {
          break // no more records to process
        }

        const save = (status, log) => {
          const logs = queueItem.get(`logs`) || []
          queueItem.set('updated', nowIso())
          queueItem.set('log', [...logs, log])
          queueItem.set('status', status)
          $app.dao().saveRecord(queueItem)
        }

        const user = $app.dao().findRecordById('users', queueItem.get('user'))
        if (!user) {
          save('error', `User not found`)
          continue
        }
        if (!user.getBool(`verified`)) {
          save(`error`, `User not verified`)
          continue
        }

        const message = $app
          .dao()
          .findRecordById('plugin_mass_mail_messages', queueItem.get('message'))
        if (!message) {
          save(`error`, `Message not found`)
          continue
        }
        if (message.getString(`status`) !== 'publish') {
          save(`retry`, `Message not published`)
          continue
        }

        const channel = $app
          .dao()
          .findRecordById('plugin_mass_mail_channels', message.get('channel'))
        if (!channel) {
          save(`error`, `Channel not found`)
          continue
        }

        const unsubscribed = (() => {
          try {
            const unsubscribed = new Record()
            $app
              .dao()
              .recordQuery('plugin_mass_mail_unsubscribe')
              .andWhere(
                $dbx.exp(
                  `user = '${user.get(`id`)}' and channel = '${channel.get(
                    `id`,
                  )}'`,
                ),
              )
              .limit(1)
              .one(unsubscribed)
            return unsubscribed
          } catch (e) {
            console.log(e)
          }
        })()
        if (unsubscribed && unsubscribed.get(`id`)) {
          save(`error`, `User unsubscribed`)
          continue
        }

        const footer = (user) => `
      <hr/>
      <div style="color: #ccc; font-size: 8pt">
        <p>This message is from ${channel.getString(
          'name',
        )}. Our mailing address is: ${channel.getString('address')}.
        <p>You are receiving this email because ${channel.getString(
          'reason',
        )}. <a href="${
          $app.settings().meta.appUrl
        }/api/plugins/mass-mail/unsubscribe/${channel.getString(
          'id',
        )}/${user.getString('id')}" style="color: #ccc">unsubscribe</a>
      </div>
  
      `

        const email = new MailerMessage({
          from: {
            address: $app.settings().meta.senderAddress,
            name: $app.settings().meta.senderName,
          },
          to: [{ address: user.email() }],
          subject: message.getString('subject'),
          html: `${message.getString('body')}\n${footer(user)}`,
        })

        // $app.newMailClient().send(email)

        const msg = `Sent to ${email.to[0].address}`
        save(`sent`, msg)
        console.log(msg)
      } while (now() - start < 50 * 1000) // run for 50 seconds
    })

    routerAdd(
      'GET',
      '/api/plugins/mass-mail/unsubscribe/:channelId/:userId',
      (c) => {
        const channelId = c.pathParam('channelId')
        const userId = c.pathParam('userId')

        return c.json(200, { channelId, userId })
      },
      // $apis.requireRecordAuth(),
    )

    routerAdd(
      'POST',
      '/api/plugins/mass-mail/messages/:messageId/send',
      (c) => {
        const messageId = c.pathParam('messageId')
        const MESSAGES = `plugin_mass_mail_messages`
        const QUEUE = `plugin_mass_mail_message_queue`

        const message = $app.dao().findRecordById(MESSAGES, messageId)
        const isDraft = message.getString('status') === 'draft'

        if (!isDraft) {
          return c.json(403, 'Message already sent')
        }
        $app.dao().runInTransaction((txDao) => {
          message.set('status', 'publish')
          txDao
            .db()
            .newQuery(
              `
      INSERT INTO ${QUEUE} (user, message, status)
      SELECT users.id, '${messageId}', 'queued'
      FROM users
      WHERE verified = 1;
      `,
            )
            .execute()
          txDao.saveRecord(message)
        })

        return c.json(200, `message queued`)
      },
      // $apis.requireRecordAuth(),
    )

    routerAdd(
      'POST',
      '/api/plugins/mass-mail/messages/:messageId/test',
      (c) => {
        const MESSAGES = `plugin_mass_mail_messages`
        const messageId = c.pathParam('messageId')

        const message = $app.dao().findRecordById(MESSAGES, messageId)
        $app.dao().expandRecord(message, ['channel'], null)
        const channel = message.expandedOne('channel')
        $app.dao().expandRecord(channel, ['test_users'], null)

        const footer = (user) => `
      <hr/>
      <div style="color: #ccc; font-size: 8pt">
        <p>This message is from ${channel.getString(
          'name',
        )}. Our mailing address is: ${channel.getString('address')}.
        <p>You are receiving this email because ${channel.getString(
          'reason',
        )}. <a href="${
          $app.settings().meta.appUrl
        }/api/plugins/mass-mail/unsubscribe/${channel.getString(
          'id',
        )}/${user.getString('id')}" style="color: #ccc">unsubscribe</a>
      </div>
  
      `
        const emails = channel.expandedAll('test_users').map((user) => {
          const email = new MailerMessage({
            from: {
              address: $app.settings().meta.senderAddress,
              name: $app.settings().meta.senderName,
            },
            to: [{ address: user.email() }],
            subject: message.getString('subject'),
            html: `${message.getString('body')}\n${footer(user)}`,
          })

          $app.newMailClient().send(email)

          return email
        })

        return c.json(200, { emails })
      },
      // $apis.requireRecordAuth(),
    )
  },
  migrations: {
    up: [
      // Messages
      (db) => {
        const collection = new Collection({
          id: 'srxbidjshpzgmdv',
          name: 'plugin_mass_mail_messages',
          type: 'base',
          system: false,
          schema: [
            {
              system: false,
              id: 'loh7nwit',
              name: 'channel',
              type: 'relation',
              required: true,
              presentable: false,
              unique: false,
              options: {
                collectionId: 'rm52894u4lh453f',
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 1,
                displayFields: null,
              },
            },
            {
              system: false,
              id: 'bhmnfyx3',
              name: 'subject',
              type: 'text',
              required: true,
              presentable: true,
              unique: false,
              options: {
                min: null,
                max: null,
                pattern: '',
              },
            },
            {
              system: false,
              id: '8hvslp0e',
              name: 'body',
              type: 'editor',
              required: true,
              presentable: false,
              unique: false,
              options: {
                convertUrls: false,
              },
            },
            {
              system: false,
              id: 'bqb0gewp',
              name: 'status',
              type: 'select',
              required: true,
              presentable: false,
              unique: false,
              options: {
                maxSelect: 1,
                values: ['draft', 'publish'],
              },
            },
          ],
          indexes: [],
          listRule: null,
          viewRule: null,
          createRule: null,
          updateRule: null,
          deleteRule: null,
          options: {},
        })

        return Dao(db).saveCollection(collection)
      },

      // Unsubscribe
      (db) => {
        const collection = new Collection({
          id: 'ltiw77zwhb9p7k8',
          name: 'plugin_mass_mail_unsubscribe',
          type: 'base',
          system: false,
          schema: [
            {
              system: false,
              id: 'qevjxw0c',
              name: 'user',
              type: 'relation',
              required: true,
              presentable: false,
              unique: false,
              options: {
                collectionId: 'systemprofiles0',
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 1,
                displayFields: null,
              },
            },
            {
              system: false,
              id: 'tff5kjxc',
              name: 'channel',
              type: 'relation',
              required: true,
              presentable: false,
              unique: false,
              options: {
                collectionId: 'rm52894u4lh453f',
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 1,
                displayFields: null,
              },
            },
          ],
          indexes: [],
          listRule: null,
          viewRule: null,
          createRule: null,
          updateRule: null,
          deleteRule: null,
          options: {},
        })

        return Dao(db).saveCollection(collection)
      },

      // Queue
      (db) => {
        const collection = new Collection({
          id: 'u36pcid77in7z7i',
          name: 'plugin_mass_mail_message_queue',
          type: 'base',
          system: false,
          schema: [
            {
              system: false,
              id: '3d3lr7s5',
              name: 'user',
              type: 'relation',
              required: true,
              presentable: false,
              unique: false,
              options: {
                collectionId: 'systemprofiles0',
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 1,
                displayFields: null,
              },
            },
            {
              system: false,
              id: 'kcucaa45',
              name: 'message',
              type: 'relation',
              required: true,
              presentable: true,
              unique: false,
              options: {
                collectionId: 'srxbidjshpzgmdv',
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 1,
                displayFields: null,
              },
            },
            {
              system: false,
              id: 'z9thmffp',
              name: 'status',
              type: 'select',
              required: true,
              presentable: false,
              unique: false,
              options: {
                maxSelect: 1,
                values: ['queued', 'sent', 'error', 'retry'],
              },
            },
            {
              system: false,
              id: 'dvfgcoc3',
              name: 'log',
              type: 'json',
              required: true,
              presentable: false,
              unique: false,
              options: {},
            },
          ],
          indexes: [
            'CREATE INDEX `idx_eJapfUZ` ON `plugin_mass_mail_message_queue` (`user`)',
            'CREATE INDEX `idx_D3S0GGg` ON `plugin_mass_mail_message_queue` (`message`)',
            'CREATE INDEX `idx_x7Sf6dG` ON `plugin_mass_mail_message_queue` (`created`)',
            'CREATE INDEX `idx_IGY4TFy` ON `plugin_mass_mail_message_queue` (`updated`)',
            'CREATE INDEX `idx_2EenQSA` ON `plugin_mass_mail_message_queue` (`status`)',
          ],
          listRule: null,
          viewRule: null,
          createRule: null,
          updateRule: null,
          deleteRule: null,
          options: {},
        })

        return Dao(db).saveCollection(collection)
      },

      // Channels
      (db) => {
        const collection = new Collection({
          id: 'rm52894u4lh453f',
          name: 'plugin_mass_mail_channels',
          type: 'base',
          system: false,
          schema: [
            {
              system: false,
              id: '77swaiep',
              name: 'slug',
              type: 'text',
              required: true,
              presentable: true,
              unique: false,
              options: {
                min: null,
                max: null,
                pattern: '',
              },
            },
            {
              system: false,
              id: 'trkscmhr',
              name: 'name',
              type: 'text',
              required: true,
              presentable: true,
              unique: false,
              options: {
                min: null,
                max: null,
                pattern: '',
              },
            },
            {
              system: false,
              id: 'uwvrbmwe',
              name: 'address',
              type: 'text',
              required: true,
              presentable: false,
              unique: false,
              options: {
                min: null,
                max: null,
                pattern: '',
              },
            },
            {
              system: false,
              id: 't4ik216y',
              name: 'reason',
              type: 'text',
              required: true,
              presentable: false,
              unique: false,
              options: {
                min: null,
                max: null,
                pattern: '',
              },
            },
            {
              system: false,
              id: '7rciglse',
              name: 'test_users',
              type: 'relation',
              required: true,
              presentable: false,
              unique: false,
              options: {
                collectionId: 'systemprofiles0',
                cascadeDelete: false,
                minSelect: null,
                maxSelect: null,
                displayFields: null,
              },
            },
          ],
          indexes: [
            'CREATE UNIQUE INDEX `idx_eruUUGB` ON `plugin_mass_mail_channels` (`slug`)',
          ],
          listRule: null,
          viewRule: null,
          createRule: null,
          updateRule: null,
          deleteRule: null,
          options: {},
        })

        return Dao(db).saveCollection(collection)
      },
    ],
    down: [
      (db) => {
        const dao = new Dao(db)
        const collection = dao.findCollectionByNameOrId('srxbidjshpzgmdv')

        return dao.deleteCollection(collection)
      },
      (db) => {
        const dao = new Dao(db)
        const collection = dao.findCollectionByNameOrId('ltiw77zwhb9p7k8')

        return dao.deleteCollection(collection)
      },
      (db) => {
        const dao = new Dao(db)
        const collection = dao.findCollectionByNameOrId('u36pcid77in7z7i')

        return dao.deleteCollection(collection)
      },
      (db) => {
        const dao = new Dao(db)
        const collection = dao.findCollectionByNameOrId('rm52894u4lh453f')

        return dao.deleteCollection(collection)
      },
    ],
  },
}
