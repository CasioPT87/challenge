const { AVAILABLE_LANGUAGES, DATA_SERVER_URL } = require("./constants");

const isIterableArray = (data) => {
  return !!data && Array.isArray(data) && !!data.length;
};

const getUrl = (lang) => {
  let _lang = lang;
  const isValidLanguage = AVAILABLE_LANGUAGES.includes(_lang);
  if (!isValidLanguage) _lang = AVAILABLE_LANGUAGES[0];
  return DATA_SERVER_URL.replace("language", _lang);
};

const sortItemsByPos = (items) => {
  if (isIterableArray(items) && items.length > 1) return items.sort((a,b) => a.pos - b.pos);
  return items
}

module.exports = {
  isIterableArray,
  getUrl,
  sortItemsByPos
};
