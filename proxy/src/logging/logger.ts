import pino from "pino";

/**
 * just a small pino logger with `pino-pretty` addon.
 */
export const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});
