process.env.NODE_ENV = "test"

const request = require('supertest')
const fs = require('fs')
const path = require('path')

const app = require('../app')
const Item = require("../item")
const { afterEach } = require('node:test')

const dataFilePath = path.join(__dirname, '../items.json')
const testItem = { name: "silly", price: 200 }

function resetDataFile(data){
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))
}

beforeEach(async () => {
  resetDataFile([testItem])
})

afterEach(async () => {
  resetDataFile([])
})

describe("GET /items", () => {
  test("Gets a list of items", async() => {
    const response = await request(app).get('/items')
    const { items } = response.body
    expect(response.statusCode).toBe(200)
    expect(items).toHaveLength(1)
    expect(items[0]).toEqual(testItem)
  })
})

describe("GET /items/:name", () => {
  test("Gets a single item", async () => {
    const response = await request(app).get(`/items/${testItem.name}`)
    expect(response.statusCode).toBe(200)
    expect(response.body.item).toEqual(testItem)
  })

  test("Responds with 404 if can't find item", async() => {
    const response = await request(app).get(`/items/nonexistent`)
    expect(response.statusCode).toBe(404)
  })
})

describe("POST /items", () => {
  test("Creates a new item", async() => {
    const response = await request(app)
      .post('/items')
      .send({
        name: "Taco",
        price: 0
      })
    expect(response.statusCode).toBe(201)
    expect(response.body.item).toHaveProperty("name", "Taco")
    expect(response.body.item).toHaveProperty("price", 0)

    const items = Item.findAll()
    expect(items).toHaveLength(2)
  })
})

describe("PATCH /items/:name", () => {
  test("Updates a single item", async () => {
    const response = await request(app)
      .patch(`/items/${testItem.name}`)
      .send({
        name: "Troll"
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.item).toEqual({
      name: "Troll",
      price: 200
    })

    const items = Item.findAll()
    expect(items[0].name).toEqual("Troll")
  })

  test("Responds with 404 if can't find item", async () => {
    const response = await request(app).patch(`/items/nonexisten`)
    expect(response.statusCode).toBe(404)
  })
})

describe("DELETE /items/:name", () => {
  test("Deletes a single item", async () => {
    const response = await request(app)
      .delete(`/items/${testItem.name}`)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({ message: "Deleted" })

    const items = Item.findAll()
    expect(items).toHaveLength(0)
  })
})