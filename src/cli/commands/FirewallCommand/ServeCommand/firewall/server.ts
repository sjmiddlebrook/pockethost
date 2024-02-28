import {
  APEX_DOMAIN,
  APP_NAME,
  DAEMON_PORT,
  IPCIDR_LIST,
  IS_DEV,
  MOTHERSHIP_NAME,
  MOTHERSHIP_PORT,
} from '$constants'
import { forEach } from '@s-libs/micro-dash'
import cors from 'cors'
import express, { ErrorRequestHandler } from 'express'
import 'express-async-errors'
import fs from 'fs'
import http from 'http'
import https from 'https'

import { LoggerService } from '$src/shared'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { createIpWhitelistMiddleware } from './cidr'
import { createVhostProxyMiddleware } from './createVhostProxyMiddleware'

export const firewall = async () => {
  const { debug } = LoggerService().create(`proxy`)

  const PROD_ROUTES = {
    [`${MOTHERSHIP_NAME()}.${APEX_DOMAIN()}`]: `http://localhost:${MOTHERSHIP_PORT()}`,
  }
  const DEV_ROUTES = {
    [`mail.${APEX_DOMAIN()}`]: `http://localhost:${1080}`,
    [`${MOTHERSHIP_NAME()}.${APEX_DOMAIN()}`]: `http://localhost:${MOTHERSHIP_PORT()}`,
    [`${APP_NAME()}.${APEX_DOMAIN()}`]: `http://localhost:${5174}`,
    [`superadmin.${APEX_DOMAIN()}`]: `http://localhost:${5175}`,
    [`${APEX_DOMAIN()}`]: `http://localhost:${8080}`,
  }
  const hostnameRoutes = IS_DEV() ? DEV_ROUTES : PROD_ROUTES

  // Create Express app
  const app = express()

  app.use(cors())

  // Use the IP blocker middleware
  app.use(createIpWhitelistMiddleware(IPCIDR_LIST()))

  forEach(hostnameRoutes, (target, host) => {
    app.use(createVhostProxyMiddleware(host, target, IS_DEV()))
  })

  app.get(`/_api/health`, (req, res, next) => {
    res.json({ status: 'ok' })
    res.end()
  })

  // Fall-through
  const handler = createProxyMiddleware({
    target: `http://localhost:${DAEMON_PORT()}`,
  })
  app.all(`*`, (req, res, next) => {
    const method = req.method
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl

    debug(`${method} ${fullUrl} -> ${`http://localhost:${DAEMON_PORT()}`}`)

    handler(req, res, next)
  })

  const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(500).send(err.toString())
  }
  app.use(errorHandler)

  if (IS_DEV()) {
    http.createServer(app).listen(80, () => {
      debug('HTTP server running on port 80')
    })
  } else {
    // HTTPS server options
    const httpsOptions = {
      key: fs.readFileSync(
        '/home/pockethost/pockethost/ssl/cloudflare-privkey.pem',
      ),
      cert: fs.readFileSync(
        '/home/pockethost/pockethost/ssl/cloudflare-origin.pem',
      ),
    }

    // Create HTTPS server
    https.createServer(httpsOptions, app).listen(443, () => {
      debug('HTTPS server running on port 443')
    })
  }
}
