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
test('sanity', () => {
  expect(process.env.NODE_ENV).toBe('testing')
})
//Check End Points
describe('Checking the End Points',()=>{
  test('[GET] Jokes',async()=>{
    const res = await request(server).get('/jokes')
    console.log(res.body)
    expect(res.body).toHaveLength(3)
  })
})