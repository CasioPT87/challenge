const express = require('express')
const testClient = require("supertest");
const { createHttpTerminator } = require('http-terminator')
const { prepareApp } = require('./app')

const port = 5555

describe("GET route test", () => {
  let app
  let httpTerminator
  beforeAll(async () => {
    app = prepareApp(express())
    const server = app.listen(port, () => {
        console.log(`Server listening on port: ${port}`)
    })
    httpTerminator = createHttpTerminator({ server })
  })

  afterAll(async () => {
    await httpTerminator.terminate()
  })

  it("test", async () => {
    const response = await testClient(app)
      .get("/")
      .set("Accept", "application/json")

    const { body } = response
      
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(body).toEqual({ test: 'test'})
  })
});