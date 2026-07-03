import "dotenv/config";

import bodyParser from "body-parser";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import {
  dailyRateLimitSettings,
  rateLimitPerMinuteSettings,
} from "./config/rate-limit.ts";
import { analyzePrompt } from "./middlewares/prompt-injection-detector.ts";
import { processPrompt } from "./prompt-processing.ts";
import { appConfig } from "./config/config.ts";

const app: Application = express();

app.use(dailyRateLimitSettings);
app.use(rateLimitPerMinuteSettings);
app.use(bodyParser.json());
app.post("/", processPrompt);

app.listen(appConfig.applicationPort);
