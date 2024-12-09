const db = require('../data/dbConfig')
const server = require('./server')
const request = require('supertest')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db.seed.run()
})

//Check End Points
describe('', () => {
  test('sanity', () => {
    expect(process.env.NODE_ENV).toBe('testing')
  })

  test('[POST] Register', async () => {
    await request(server).post('/register').send({ username: 'Areeba', password: '12345' })
    expect(await db('users')).toHaveLength(1);
  })
})