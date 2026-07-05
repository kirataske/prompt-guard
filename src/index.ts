import "dotenv/config";

import express, { type Application } from "express";
import bodyParser from "body-parser";

import {
  genAiDailyRLSettings,
  genAiMinuteRLSettings,
  incidentLogRequestsRLSettings,
} from "./config/rate-limit.ts";
import { analyzePromptMiddleware } from "./middlewares/prompt-injection-detector.ts";
import { processPrompt } from "./prompt-processing.ts";
import { appConfig } from "./config/config.ts";
import { logDb } from "./helpers/storage/db.ts";
import { logger } from "./logging/logger.ts";
import { getIncidents } from "./get_incidents.ts";

const app: Application = express();

app.use(bodyParser.json());
app.post(
  "/",
  genAiDailyRLSettings,
  genAiMinuteRLSettings,
  analyzePromptMiddleware,
  processPrompt,
);
app.get("/incidents", incidentLogRequestsRLSettings, getIncidents);

app.listen(appConfig.applicationPort, async () => {
  try {
    await logDb.authenticate();
    logger.info("logs database connected successfully");
    await logDb.sync({ force: appConfig.resetOnStartup });
    logger.info(
      `database was successfully ${appConfig.resetOnStartup ? "reset" : "syncronized"}`,
    );
  } catch (_) {
    logger.error("cannot connect to database, terminating application");
    process.exit(1);
  }
});
