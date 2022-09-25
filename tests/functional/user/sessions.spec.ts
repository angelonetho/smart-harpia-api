import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import { UserFactory } from './../../../database/factories/index'

test.group('Session', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should authenticate an user', async ({ client, assert }) => {
    const plainPassword = 'test'
    const { id, email } = await UserFactory.merge({ password: plainPassword }).create()
    const response = await client.post('/sessions').form({ email, password: plainPassword })
    const body = response.body()

    response.assertStatus(201)
    assert.isDefined(body.user, 'User undefined')
    assert.equal(body.user.id, id)
  })

  test('it should return an api token when session is created', async ({ client, assert }) => {
    const plainPassword = 'test'
    const { id, email } = await UserFactory.merge({ password: plainPassword }).create()
    const response = await client.post('/sessions').form({ email, password: plainPassword })
    const body = response.body()

    console.log(body.token)
    response.assertStatus(201)
    assert.isDefined(body.token, 'Token undefined')
    assert.equal(body.user.id, id)
  })

  test('it should return 400 when credentials are not provided', async ({ client, assert }) => {
    const response = await client.post('/sessions').form({})
    const body = response.body()

    response.assertStatus(400)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 400)
    assert.equal(body.message, 'invalid credentials')
  })

  test('it should return 400 when credentials are invalid', async ({ client, assert }) => {
    const { email } = await UserFactory.create()
    const response = await client.post('/sessions').form({
      email,
      password: 'test',
    })
    const body = response.body()

    response.assertStatus(400)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 400)
    assert.equal(body.message, 'invalid credentials')
  })
})