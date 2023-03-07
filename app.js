const request = require('./src/request')
const { isIterableArray } = require('./utils')

const prepareApp = (app) => {
 
  app.get("/", async (req, res, next) => {
        const data = await request({ method: "GET" });
        const sports = data?.result?.sports
        if (sports && Array.isArray(sports) && !!sports.length) return res.json(sports);
        return res.json([]);
  });

  app.get("/sports/:sportId?/events", async (req, res, next) => {
      const data = await request({ mode: "GET" });
      console.log({ data })
      const sportId = req.params.sportId
      const sports = data?.result?.sports

      if (sportId !== undefined) {
        if (isIterableArray(sports)) {
            const sport = sports.find(sport => String(sport.id) === String(sportId))
            if (sport) {
                const sportCompetitions = sport?.comp
                if (isIterableArray(sportCompetitions)) {
                    const sportEvents = sportCompetitions.map(comp => comp.events).flat()
                    return res.json(sportEvents)
                }
            }
        }
        
        return res.json([])
      }

      if (isIterableArray(sports)) {
        const allCompetitions = sports.map(sport => sport.comp).flat()
        if (isIterableArray(allCompetitions)) {
            const allEvents = allCompetitions.map(comp => comp.events).flat()
            return res.json(allEvents)
        }
    }
      return res.json([])
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' })
  })

  return app;
};

module.exports = {
    prepareApp,
};
