import { Sequelize } from "sequelize-typescript";

import { PromptResultModel } from "./prompts-model.ts";
import { IncidentLogModel } from "./log-model.ts";

// TODO: should we encrypt incidents database?
/**
 * Sequelize Database Object.
 */
export const appDb = new Sequelize({
  dialect: "sqlite",
  storage: ".storage/app.db",
});

// according to `sequelize-typescript` docs we should add models like this.
appDb.addModels([PromptResultModel, IncidentLogModel]);
