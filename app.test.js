const express = require("express");
const testClient = require("supertest");
const { createHttpTerminator } = require("http-terminator");
const { prepareApp } = require("./app");
const cache = require("./src/cache");
const fetch = require("node-fetch");
const middlewares = require("./src/middlewares");

jest.mock("node-fetch");

const port = 5555;

describe("GET route test", () => {
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

  describe("all sports", () => {
    it("return sports", async () => {
      const responseData = {
        result: {
          sports: ["my sport"],
        },
      };

      fetch.mockResolvedValue({
        ok: true,
        json: () => responseData,
      });
      const response = await testClient(app).get("/sports");

      const { body: data } = response;

      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(200);
      expect(data).toStrictEqual(["my sport"]);
    });

    it("return empty array if fetched data has unexpected format", async () => {
      const responseData = {
        result: {
          sports: { "my sport": "this should be an array" },
        },
      };

      fetch.mockResolvedValue({
        ok: true,
        json: () => responseData,
      });
      const response = await testClient(app).get("/sports");

      const { body: data } = response;

      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(200);
      expect(data).toEqual(expect.arrayContaining([]));
    });

    it("catches error and sends it to middleware to handle it", async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: () => {
          throw new Error("something went terribly wrong");
        },
      });
      const response = await testClient(app).get("/sports");

      const { body: data } = response;

      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(500);
      expect(data).toStrictEqual({ error: "Error fetching data" });
    });
  });

  describe("events by (optional) sportId", () => {
    it("returns sports's events when sportId is a param", async () => {
      const responseData = {
        result: {
          sports: [
            {
              id: 222,
              comp: [{ events: ["first-event"] }],
            },
            {
              id: 444,
              comp: [
                { events: ["second-event", "third-event"] },
                { events: ["fourth-event"] },
              ],
            },
          ],
        },
      };

      fetch.mockResolvedValue({
        ok: true,
        json: () => responseData,
      });
      const response = await testClient(app).get("/sports/444/events");

      const { body: data } = response;

      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(200);
      expect(data).toEqual(
        expect.arrayContaining(["second-event", "third-event", "fourth-event"])
      );
      expect(data).toEqual(expect.not.arrayContaining(["first-event"]));
    });

    it("returns all events when sportId is NOT a param", async () => {
      const responseData = {
        result: {
          sports: [
            {
              id: 222,
              comp: [{ events: ["first-event"] }],
            },
            {
              id: 444,
              comp: [
                { events: ["second-event", "third-event"] },
                { events: ["fourth-event"] },
              ],
            },
          ],
        },
      };

      fetch.mockResolvedValue({
        ok: true,
        json: () => responseData,
      });
      const response = await testClient(app).get("/sports/events");

      const { body: data } = response;

      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(200);
      expect(data).toEqual(
        expect.arrayContaining([
          "first-event",
          "second-event",
          "third-event",
          "fourth-event",
        ])
      );
    });

    it("(sportId defined) returns empty array if fetched data has unexpected format", async () => {
      const responseData = {
        result: {
          sports: [
            {
              id: 222,
              comp: { events: ["first-event"] }, // this should be an array
            },
          ],
        },
      };

      fetch.mockResolvedValue({
        ok: true,
        json: () => responseData,
      });
      const response = await testClient(app).get("/sports/222/events");

      const { body: data } = response;

      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(200);
      expect(data).toEqual(expect.arrayContaining([]));
    });

    it("(sportId NOT defined) returns empty array if fetched data has unexpected format", async () => {
      const responseData = {
        result: {
          other: {
            sports: [
              {
                id: 222,
                comp: { events: ["first-event"] }, // this should be an array
              },
            ],
          },
        },
      };

      fetch.mockResolvedValue({
        ok: true,
        json: () => responseData,
      });
      const response = await testClient(app).get("/sports/events");

      const { body: data } = response;

      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(200);
      expect(data).toEqual(expect.arrayContaining([]));
    });

    it("catches error and sends it to middleware to handle it", async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: () => {
          throw new Error("something went terribly wrong");
        },
      });
      const response = await testClient(app).get("/sports/222/events");

      const { body: data } = response;

      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(500);
      expect(data).toStrictEqual({ error: "Error fetching data" });
    });
  });

  describe("events", () => {
    it("returns event data by given eventId", async () => {
      const responseData = {
        result: {
          sports: [
            {
              id: 222,
              comp: [{ events: [{ id: 528, data: "event-528" }] }],
            },
            {
              id: 444,
              comp: [
                {
                  events: [
                    { id: 154, data: "event-154" },
                    { id: 214, data: "event-214" },
                  ],
                },
                { events: [{ id: 668, data: "event-668" }] },
              ],
            },
          ],
        },
      };

      fetch.mockResolvedValue({
        ok: true,
        json: () => responseData,
      });

      const response = await testClient(app).get("/events/214");
      const { body: data } = response;

      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(200);
      expect(data).toStrictEqual({ id: 214, data: "event-214" });
    });

    it("returns empty object if sports has unexpected format", async () => {
      const responseData = {
        result: {
          sports: { hey: 'this should be an array'}
        },
      };

      fetch.mockResolvedValue({
        ok: true,
        json: () => responseData,
      });

      const response = await testClient(app).get("/events/214");
      const { body: data } = response;

      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(200);
      expect(data).toStrictEqual({});
    });

    it("catches error and sends it to middleware to handle it", async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: () => {
          throw new Error("something went terribly wrong");
        },
      });
      const response = await testClient(app).get("/events/214");

      const { body: data } = response;

      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(500);
      expect(data).toStrictEqual({ error: "Error fetching data" });
    });
  });

  describe("multilanguage sports", () => {
    it("returns sports in all available languages", async () => {
      const sportsEnglish = ["my sport in english"];
      const sportsGerman = ["my sport in german"];
      const sportsChinese = ["my sport in chinese"];

      const fetchMockData = {
        english: {
          url: "https://partners.betvictor.mobi/en-gb/in-play/1/events",
          data: {
            result: {
              sports: sportsEnglish,
            },
          },
        },
        german: {
          url: "https://partners.betvictor.mobi/de/in-play/1/events",
          data: {
            result: {
              sports: sportsGerman,
            },
          },
        },
        chinese: {
          url: "https://partners.betvictor.mobi/zh/in-play/1/events",
          data: {
            result: {
              sports: sportsChinese,
            },
          },
        },
      };

      fetch.mockImplementation((url) => ({
        ok: true,
        json: () => {
          switch (url) {
            case fetchMockData.english.url:
              return fetchMockData.english.data;
            case fetchMockData.german.url:
              return fetchMockData.german.data;
            case fetchMockData.chinese.url:
              return fetchMockData.chinese.data;
            default:
              return fetchMockData.english.data;
          }
        },
      }));

      const response = await testClient(app).get("/sports/multilanguage");
      const { body: data } = response;
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(200);
      expect(data).toEqual(
        expect.arrayContaining([
          ...sportsEnglish,
          ...sportsGerman,
          ...sportsChinese,
        ])
      );
    });

    it("returns empty array if fetched data has unexpected format", async () => {
      const responseData = {
        result: {
          sports: { hey: 'this should be an array'}
        },
      };
      fetch.mockResolvedValue({
        ok: true,
        json: () => responseData,
      });
      const response = await testClient(app).get("/sports/multilanguage");

      const { body: data } = response;

      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(200);
      expect(data).toEqual(expect.arrayContaining([]));
    });

    it("catches error and sends it to middleware to handle it", async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: () => {
          throw new Error("something went terribly wrong");
        },
      });
      const response = await testClient(app).get("/sports/multilanguage");

      const { body: data } = response;

      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(500);
      expect(data).toStrictEqual({ error: "Error fetching data" });
    });
  });

  describe("route not present", () => {
    it("returns json indicating error and 404 status", async () => {
      const response = await testClient(app).get("/this-path-is-not-present");
      const { body: data } = response;

      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(404);
      expect(data).toStrictEqual({ error: "Route not found" });
    });
  });
});
