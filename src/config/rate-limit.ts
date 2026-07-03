import { rateLimit, type RateLimitRequestHandler } from "express-rate-limit";

import { appConfig } from "./config.ts";

export const rateLimitPerMinuteSettings: RateLimitRequestHandler = rateLimit({
  windowMs: appConfig.requestsWindowPerMinuteInMs,
  limit: appConfig.requestsPerIpPerMinute,
  standardHeaders: appConfig.useStandartHeaders,
  legacyHeaders: appConfig.useLegacyHeaders,
  message: {
    status: "rate_limited_minute",
    message: "too many requests per minute, please try again",
  },
});

export const dailyRateLimitSettings: RateLimitRequestHandler = rateLimit({
  windowMs: appConfig.dailyRequestsWindowInMs,
  limit: appConfig.dailyRequestsPerIp,
  standardHeaders: appConfig.useStandartHeaders,
  legacyHeaders: appConfig.useLegacyHeaders,
  message: {
    status: "daily_limit_reached",
    message: "daily limit has been reached, return in 24 hours to reset limit.",
  },
});
