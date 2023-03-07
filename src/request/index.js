const fetch = require("node-fetch");

const request = async () => {
  try {

    const requestParams = {
      method: 'GET',
      headers: {
        Accept: "*/*",
      },
    };

    const response = await fetch('https://partners.betvictor.mobi/en-gb/in-play/1/events', requestParams);

    if (response.ok) {
      return response.json()
    } else {
      throw new Error("Error fetching data");
    }
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = request;
