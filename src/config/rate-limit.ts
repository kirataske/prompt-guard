import { rateLimit, type RateLimitRequestHandler } from "express-rate-limit";

import { appConfig } from "./config.ts";

export const rateLimitSettings: RateLimitRequestHandler = rateLimit({
  windowMs: appConfig.requestsWindowInMs,
  limit: appConfig.requestsPerIp,
  standardHeaders: appConfig.useStandartHeaders,
  legacyHeaders: appConfig.useLegacyHeaders,
});
