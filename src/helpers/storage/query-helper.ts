import type { IncidentLog } from "../../logging/incident.ts";
import { PromptResultModel } from "./prompts-model.ts";
import { IncidentLogModel } from "./log-model.ts";

export interface IPromptResult {
  calculatedHash: string;
  promptResult: string;
}

export interface IPromptResultWIncident extends IPromptResult {
  incident: IncidentLog;
}

export class ILMHelper {
  // TODO: are we implementing pagination on proxy side?
  // for now letting it as is.
  public static async obtainIncidents() {
    return await IncidentLogModel.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
  }
}

export class PRMHelper {
  public static async obtainPromptFromCache(calculatedHash: string) {
    return await PromptResultModel.findOne({
      where: {
        calculatedHash: calculatedHash,
      },
      include: [IncidentLogModel],
    });
  }

  public static async cachePrompt({
    calculatedHash,
    promptResult,
  }: IPromptResult): Promise<void> {
    await PromptResultModel.create({
      calculatedHash: calculatedHash,
      promptResult: promptResult,
    });
  }

  public static async cachePromptWIncident({
    calculatedHash,
    promptResult,
    incident,
  }: IPromptResultWIncident): Promise<void> {
    await PromptResultModel.create(
      {
        calculatedHash: calculatedHash,
        promptResult: promptResult,
        incident: {
          userIp: incident.userIp,
          severity: incident.severity,
          attackType: incident.attackType,
          verdict: incident.verdict,
          segment: incident.segment,
        },
      },
      {
        include: [IncidentLogModel],
      },
    );
  }
}
