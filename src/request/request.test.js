const appFetch = require("./index");
const fetch = require("node-fetch");
const cache = require('../cache')

jest.mock("node-fetch");

describe("fetch", () => {
  beforeEach(() => {
    cache.flushAll()
  })

  it("returns data when response is ok", async () => {
    const response = { test: 'test' }
    fetch.mockResolvedValue({
      ok: true,
      json: () => response,
    });
    const data = await appFetch();
    expect(data).toStrictEqual(response);
  });

  it("throws error when response is not ok", async () => {
    const response = { test: 'test' }
    fetch.mockResolvedValue({
      ok: false,
      json: () => response,
    });
    await expect(appFetch()).rejects.toStrictEqual(new Error('Error fetching data'));
  });
});
