const fetch = require("node-fetch");
const cache = require('../cache')

const request = async ({ method }) => {
  try {

    if (cache.has('source')) {
        return cache.get('source');
      }

    const requestParams = {
      method,
      headers: {
        Accept: "*/*",
      },
    };

    const response = await fetch('https://partners.betvictor.mobi/en-gb/in-play/1/events', requestParams);

    if (response.ok) {
      const responseData = await response.json()
      cache.set('source', responseData);
      return responseData
    } else {
      throw new Error("Error fetching data");
    }
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = request;
