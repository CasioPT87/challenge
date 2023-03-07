const { AVAILABLE_LANGUAGES, DATA_SERVER_URL } = require('./constants')

const isIterableArray = (data) => {
  return !!data && Array.isArray(data) && !!data.length;
};

const getUrl = (lang) => {
  let _lang = lang;
  const isValidLanguage = AVAILABLE_LANGUAGES.includes(_lang);
  if (!isValidLanguage) _lang = AVAILABLE_LANGUAGES[0];
  return DATA_SERVER_URL.replace("language", _lang);
};

module.exports = {
  isIterableArray,
  getUrl,
};
