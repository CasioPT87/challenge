const request = require("./src/request");
const { isIterableArray, sortItemsByPos } = require("./utils");
const { logErrorMiddleware } = require("./src/middlewares");
const { AVAILABLE_LANGUAGES } = require("./constants");

const prepareApp = (app) => {
  app.get("/:lang?/sports", async (req, res, next) => {
    try {
      const lang = req.params.lang;
      const data = await request({ method: "GET", lang });
      const sports = data?.result?.sports;
      if (sports && Array.isArray(sports) && !!sports.length) {
        const sortedSports = sortItemsByPos(sports)
        return res.json(sortedSports);
      }  
      return res.json([]);
    } catch (e) {
      next(e);
    }
  });

  app.get("/:lang?/sports/:sportId?/events", async (req, res, next) => {
    try {
      const lang = req.params.lang;
      const data = await request({ mode: "GET", lang });
      const sportId = req.params.sportId;
      const sports = data?.result?.sports;

      if (sportId !== undefined) {
        if (isIterableArray(sports)) {
          const sport = sports.find(
            (sport) => String(sport.id) === String(sportId)
          );
          if (sport) {
            const sportCompetitions = sport?.comp;
            if (isIterableArray(sportCompetitions)) {
              const sportEvents = sportCompetitions
                .map((comp) => comp.events)
                .flat();
              const sortedSportEvents = sortItemsByPos(sportEvents)
              return res.json(sortedSportEvents);
            }
          }
        }
        return res.json([]);
      }

      if (isIterableArray(sports)) {
        const allCompetitions = sports.map((sport) => sport.comp).flat();
        if (isIterableArray(allCompetitions)) {
          const allEvents = allCompetitions.map((comp) => comp.events).flat();
          const sortedAllEvents = sortItemsByPos(allEvents)
          return res.json(sortedAllEvents);
        }
      }
      return res.json([]);
    } catch (e) {
      next(e);
    }
  });

  app.get("/:lang?/events/:eventId", async (req, res, next) => {
    try {
      const lang = req.params.lang;
      const data = await request({ mode: "GET", lang });
      const sports = data?.result?.sports;
      const eventId = req.params.eventId;

      if (isIterableArray(sports)) {
        const allCompetitions = sports.map((sport) => sport.comp).flat();
        if (isIterableArray(allCompetitions)) {
          const allEvents = allCompetitions.map((comp) => comp.events).flat();
          if (isIterableArray(allEvents)) {
            const event = allEvents.find(
              (event) => String(event.id) === String(eventId)
            );
            return res.json(event);
          }
        }
      }

      return res.json({});
    } catch (e) {
      next(e);
    }
  });

  app.get("/sports/multilanguage", async (req, res, next) => {
    try {
      const langs = AVAILABLE_LANGUAGES;
      const fetchRequests = langs.map(async (lang) => {
        const data = await request({ mode: "GET", lang });
        const languageSports = data?.result?.sports;
        return isIterableArray(languageSports) ? languageSports : [];
      });
      const sports = await Promise.all(fetchRequests);
      const sortedSports = sortItemsByPos(sports.flat())
      return res.json(sortedSports);
    } catch (e) {
      next(e);
    }
  });

  app.use(logErrorMiddleware);

  app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  return app;
};

module.exports = {
  prepareApp,
};
