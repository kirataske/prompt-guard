import { Sequelize } from "sequelize-typescript";

import { PromptResultModel } from "./prompts-model.ts";
import { IncidentLogModel } from "./log-model.ts";

// TODO: should we encrypt incidents database?
export const appDb = new Sequelize({
  dialect: "sqlite",
  storage: ".storage/app.db",
});

appDb.addModels([PromptResultModel, IncidentLogModel]);
