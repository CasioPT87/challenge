const express = require("express");
const testClient = require("supertest");
const { createHttpTerminator } = require("http-terminator");
const { prepareApp } = require("../../app");
const cache = require("../cache");
const fetch = require("node-fetch");
const logger = require("../logger");

jest.mock("node-fetch");

jest.mock("../logger", (e) => {
  return {
    error: jest.fn()
  }
});

const port = 5555;

describe("logErrorMiddleware", () => {
  let app;
  let httpTerminator;
  beforeAll(async () => {
    app = prepareApp(express());
    const server = app.listen(port, () => {
      console.log(`Server listening on port: ${port}`);
    });
    httpTerminator = createHttpTerminator({ server });
  });

  beforeEach(() => {
    cache.flushAll();
  });

  afterAll(async () => {
    await httpTerminator.terminate();
  });

  it("calls logger passing error", async () => {

    fetch.mockResolvedValue({
      ok: true,
      json: () => {
        throw new Error('this is a fake error message')
      },
    });
    
    await testClient(app).get("/");

    expect(logger.error).toHaveBeenCalledWith(new Error('this is a fake error message'))
  });

  it("catches error", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => {
        throw new Error('this is a fake error message')
      },
    });
    
    await expect(testClient(app).get("/")).resolves.toEqual(expect.anything())
  });

  it("sends response with right status", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => {
        throw new Error('this is a fake error message')
      },
    });
    
    const response = await testClient(app).get("/");

    const { body: data } = response;

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(500);
    expect(data).toStrictEqual({ error: 'Error fetching data' })
  });
});
