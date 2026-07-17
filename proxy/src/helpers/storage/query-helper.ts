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

/**
 * helps with queries to incidents model, as the name implies.
 */
export class ILMHelper {
  /**
   *
   * @returns list of ALL incidents.
   */
  public static async obtainIncidents() {
    // TODO: are we implementing pagination on proxy side?
    // for now letting it as is.
    return await IncidentLogModel.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
  }
}

/**
 * helps with queries to prompts model, as the name implies.
 */
export class PRMHelper {
  /**
   * finds prompt result, basend on hash calculated from user prompt.
   * @param calculatedHash hash... calculated from user prompt? as i've mentioned above.
   * @returns user prompt with related incident if that one exists.
   */
  public static async obtainPromptFromCache(calculatedHash: string) {
    return await PromptResultModel.findOne({
      where: {
        calculatedHash: calculatedHash,
      },
      include: [IncidentLogModel],
    });
  }

  /**
   * as name implies, it stores result of prompt in DB.
   * @param param0
   * @param param0.calculatedHash hash... calculated from user prompt.
   * @param param0.promptResult   response to prompt from external LLM.
   */
  public static async cachePrompt({
    calculatedHash,
    promptResult,
  }: IPromptResult): Promise<void> {
    await PromptResultModel.create({
      calculatedHash: calculatedHash,
      promptResult: promptResult,
    });
  }

  /**
   * same deal, but with occured incident.
   * @param param0
   * @param param0.calculatedHash hash... calculated from user prompt.
   * @param param0.promptResult   response to prompt from external LLM (note - redundant, we'll never receive response if incident occured).
   * @param param0.incident       occured incident.
   */
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
          sessionId: incident.sessionId,
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
