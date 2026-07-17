import axios from "axios";

import type { UserPrompt } from "../forms/prompt.ts";

import { IncidentLog, Severity } from "../logging/incident.ts";
import { appConfig } from "../config/config.ts";

/**
 * DTO for received response from detector.
 */
export interface IDetectorResponse {
  verdict: string;
  severity: string;
  attackType: string;
  segment: string;
}

// TODO: better naming: despite having "severe" in name, it'll return 'true' even if incident.severity = 'medium'.
/**
 * checks if received incident contains data about somewhat severe incident.
 * @param incident object of IncidentLog.
 * @returns if incident's severity isn't low.
 */
export function isIncidentSevere(incident: IncidentLog): boolean {
  return incident.severity != Severity.LOW;
}

/**
 * sends prompt to detector for analysis, then returns verdict nonetherless of results.
 *
 * note: function isn't wrapped in try/catch block because it supposed to be used in places where body wrapped in try/catch block.
 * @param prompt  user's prompt to analyze.
 * @param userIp  user's IP if one was collected.
 * @returns IncidentLog object.
 */
export async function analyzePrompt(
  prompt: UserPrompt,
  userIp: string | undefined,
): Promise<IncidentLog> {
  const response = await axios.post(`${appConfig.detectorModelUrl}/analyze`, {
    text: prompt.prompt,
  });

  const { verdict, severity, attackType, segment }: IDetectorResponse =
    response.data as IDetectorResponse;

  return new IncidentLog(
    prompt.sessionId,
    userIp,
    attackType,
    severity,
    verdict,
    segment,
  );
}
