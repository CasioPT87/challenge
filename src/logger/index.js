const winston = require("winston");

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "warn" : "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.File({
      filename:
        process.env.NODE_ENV === "production"
          ? "production.log"
          : "non-production.log",
      level: "info",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize()),
    })
  );
}

module.exports = logger;
