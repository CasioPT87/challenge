const appFetch = require("./index");
const fetch = require("node-fetch");
const cache = require("../cache");

jest.mock("node-fetch");

describe("fetch", () => {
  beforeEach(() => {
    cache.flushAll();
  });

  it("returns data when response is ok", async () => {
    const response = { test: "test" };
    fetch.mockResolvedValue({
      ok: true,
      json: () => response,
    });
    const data = await appFetch({ method: "GET" });
    expect(data).toStrictEqual(response);
  });

  it("throws error when response is not ok", async () => {
    const response = { test: "test" };
    fetch.mockResolvedValue({
      ok: false,
      json: () => response,
    });
    await expect(appFetch({ method: "GET" })).rejects.toStrictEqual(
      new Error("Error fetching data")
    );
  });

  it("catches response for url", async () => {
    const responseData = { data: "my-data" };
    fetch.mockResolvedValue({
      ok: true,
      json: () => responseData,
    });
    const dataFirsCall = await appFetch({ method: "GET", lang: "de" });
    const dataSecondCall = await appFetch({ method: "GET", lang: "de" });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(dataFirsCall).toStrictEqual(dataSecondCall);
    expect(dataFirsCall).toStrictEqual(responseData);
  });
});
