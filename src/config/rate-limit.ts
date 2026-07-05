import { rateLimit, type RateLimitRequestHandler } from "express-rate-limit";

import { appConfig } from "./config.ts";

// limits for requesting incident logs.
export const incidentLogRequestsRLSettings: RateLimitRequestHandler = rateLimit(
  {
    windowMs: appConfig.incidentRequestWindowInMs,
    limit: appConfig.incidentRequestsPerIp,
    standardHeaders: appConfig.useStandartHeaders,
    legacyHeaders: appConfig.useLegacyHeaders,
    message: {
      status: "incidentlogs_limitreached",
      // TODO: are we adding "expiresAt" field?
      message: "too many incident log requests, please try again later.",
    },
  },
);

// limit for generating responses (per minute).
// based on Gemini API Rate Limits.
export const genAiMinuteRLSettings: RateLimitRequestHandler = rateLimit({
  windowMs: appConfig.genAiMinuteWindowInMs,
  limit: appConfig.genAiRequestsPerMinute,
  standardHeaders: appConfig.useStandartHeaders,
  legacyHeaders: appConfig.useLegacyHeaders,
  message: {
    status: "genai_minute_limitreached",
    // TODO: are we adding "expiresAt" field?
    message: "too many requests per minute, please try again",
  },
});

// daily limit for generating responses.
// based on Gemini API Rate Limits.
export const genAiDailyRLSettings: RateLimitRequestHandler = rateLimit({
  windowMs: appConfig.genAiDailyWindowInMs,
  limit: appConfig.genAiDailyRequestsPerIp,
  standardHeaders: appConfig.useStandartHeaders,
  legacyHeaders: appConfig.useLegacyHeaders,
  message: {
    status: "genai_daily_limitreached",
    // TODO: are we adding "expiresAt" field?
    message:
      "daily limit has been reached, return in 24 hours when limit resets",
  },
});
