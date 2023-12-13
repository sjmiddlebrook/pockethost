/// <reference path="../types/types.d.ts" />

const files = $filepath.glob([__hooks, `plugins/*`].join('/'))
files.forEach((file) => {
  try {
    const plugin = require([file, 'backend.js'].join('/'))
    plugin.init()
    console.log(`***plugin`, { plugin })
  } catch (e) {
    console.error(`Skipping plugin ${file}: ${e}`)
  }
})
console.log(`***files`, files)

routerAdd(`GET`, `/api/ping`, (c) => {
  return c.json(200, { message: 'Hello!' })
})
