/// <reference path="../../types/types.d.ts" />

routerUse((next) => {
  return (c) => {
    const globals = require(`${__hooks}/pockethost-globals.js`)
    if (globals.hasRun) {
      console.log(`***already ran`)
      return next(c)
    }
    console.log(`***running for the first time`)
    globals.hasRun = true
    try {
      //  {"id": "...", "email": "ben@pockethost.io", "tokenKey": "...", "passwordHash": "..."}
      const { PH_ADMIN_USER_INFO } = process.env

      console.log(`***PH_ADMIN_USER_INFO`, PH_ADMIN_USER_INFO)

      const { id, email, tokenKey, passwordHash } =
        JSON.parse(PH_ADMIN_USER_INFO)

      console.log(
        `***parsed`,
        JSON.stringify({ id, email, tokenKey, passwordHash }),
      )

      const upsertSql = `
    INSERT INTO _admins(id, email, tokenKey, passwordHash) 
    VALUES 
      (
        '${id}', '${email}', 
        '${tokenKey}', 
        '${passwordHash}'
      ) ON CONFLICT(id) DO 
    UPDATE 
    SET 
      email = '${email}', 
      tokenKey = '${tokenKey}', 
      passwordHash = '${passwordHash}';
      `
      console.log(`***upsert`, upsertSql)

      $app.dao().db().newQuery(upsertSql).execute() // throw an error on db failure
    } catch (e) {
      console.error(`***sync admin error ${e}`)
    }
    return next(c)
  }
})
