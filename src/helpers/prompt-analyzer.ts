import { IncidentLog, Severity } from "../logging/incident.ts";

// TODO: better naming: despite having "severe" in name, it'll return 'true' even if incident.severity = 'medium'.
export function isIncidentSevere(incident: IncidentLog): boolean {
  if (incident.severity == Severity.LOW) return false;
  return true;
}

export async function analyzePrompt(
  userIp: string,
  // prompt?: string,
): Promise<IncidentLog> {
  // TODO: waiting for detector implementation and format establishment.
  // TODO: implement API calls to detector via axios.
  return await new IncidentLog(userIp);
}
