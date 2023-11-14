/// <reference path="../types/types.d.ts" />

/*
{
  "id": "user-id"
}
*/
routerAdd(
  'GET',
  '/api/userToken',
  (c) => {
    let data = new DynamicModel({
      id: '',
    })

    console.log(`***before bind`)

    c.bind(data)

    console.log(`***after bind`)

    // This is necessary for destructuring to work correctly
    data = JSON.parse(JSON.stringify(data))

    const { id } = data

    console.log(`***vars`, JSON.stringify({ id }))

    if (!id) {
      throw new BadRequestError(`User ID is required.`)
    }

    const rec = $app.dao().findRecordById('users', id)
    const tokenKey = rec.getString('tokenKey')
    const passwordHash = rec.getString('passwordHash')
    const email = rec.getString(`email`)
    console.log(`***tokenKey`, tokenKey)

    return c.json(200, { email, passwordHash, tokenKey })
  },
  $apis.requireAdminAuth(),
)
