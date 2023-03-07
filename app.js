const prepareApp = (app) => {
 
  app.get("/", (req, res, next) => {
    res.json({ test: 'test'})
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' })
  })

  return app;
};

module.exports = {
    prepareApp,
};
