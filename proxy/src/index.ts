import "dotenv/config";

import express, { type Application } from "express";

import {
  genAiDailyRLSettings,
  genAiMinuteRLSettings,
  incidentLogRequestsRLSettings,
} from "./config/rate-limit.ts";
import { analyzePromptMiddleware } from "./middlewares/prompt-injection-detector.ts";
import { parseBody } from "./middlewares/parse-body.ts";
import { processPrompt } from "./prompt-processing.ts";
import { lookupDb } from "./middlewares/check-db.ts";
import { getIncidents } from "./get_incidents.ts";
import { appDb } from "./helpers/storage/db.ts";
import { appConfig } from "./config/config.ts";
import { logger } from "./logging/logger.ts";
import cors from "cors";

import { mw } from "request-ip";

const app: Application = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  }),
);
app.use(mw());
app.use(express.json());
app.post(
  "/",
  genAiDailyRLSettings,
  genAiMinuteRLSettings,
  parseBody,
  lookupDb,
  analyzePromptMiddleware,
  processPrompt,
);
app.get("/incidents", incidentLogRequestsRLSettings, getIncidents);

app.listen(appConfig.applicationPort, async () => {
  try {
    await appDb.authenticate();
    logger.info("logs database connected successfully");
    await appDb.sync({ force: appConfig.resetOnStartup });
    logger.info(
      `database was successfully ${appConfig.resetOnStartup ? "reset" : "syncronized"}`,
    );
  } catch (_) {
    logger.error(_);
    logger.error("cannot connect to database, terminating application");
    process.exit(1);
  }
});
