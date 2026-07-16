import axios from "axios";

import type { UserPrompt } from "../forms/prompt.ts";

import { IncidentLog, Severity } from "../logging/incident.ts";
import { appConfig } from "../config/config.ts";

export interface IDetectorResponse {
  verdict: string;
  severity: string;
  attackType: string;
  segment: string;
}

// TODO: better naming: despite having "severe" in name, it'll return 'true' even if incident.severity = 'medium'.
export function isIncidentSevere(incident: IncidentLog): boolean {
  return incident.severity != Severity.LOW;
}

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
