const fetch = require("node-fetch");
const cache = require("../cache");
const { getUrl } = require("../../utils");

const request = async ({ method, lang }) => {
  try {

    const url = getUrl(lang);

    if (cache.has(url)) {
      return cache.get(url);
    }

    const requestParams = {
      method,
      headers: {
        Accept: "*/*",
      },
    };

    const response = await fetch(
      url,
      requestParams
    );

    if (response.ok) {
      const responseData = await response.json();
      cache.set(url, responseData);
      return responseData;
    } else {
      throw new Error("Error fetching data");
    }
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = request;
