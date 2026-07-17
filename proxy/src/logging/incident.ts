/**
 * kind of enumeration that contains expected types of attack.
 */
export const AttackType = {
  NONE: "none",
  DIRECT_INJECTION: "direct_injection",
  INDIRECT_RAG: "indirect_injection",
  SYS_PROMPT_LEAK: "system_prompt_leak",
  RP_BYPASS: "role_play",
  OBFUSCATION: "obfuscation",
  PAYLOAD_SPLIT: "payload_split",
};

/**
 * kind of enumeration that contains possible verdicts.
 *
 * note: `suspicious` is never used, because detector either wants to block or to pass prompt.
 */
export const Verdict = {
  CLEAN: "clean",
  SUSPICIOUS: "suspicious",
  BLOCKED: "blocked",
};

/**
 * kind of enumeration that contains possible levels of severity.
 *
 * note: `medium` shares same fate with `suspicious`.
 */
export const Severity = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

/**
 * DTO for incidents, nothing more.
 */
export class IncidentLog {
  public sessionId: string;
  public userIp?: string | undefined;
  public attackType: string;
  public severity: string;
  //   happenedAt: string
  public verdict: string;
  public segment: string;

  /**
   *
   * @param {string}  sessionId                       ID of session/user that sent the prompt.
   * @param {string=} userIp                          user IP, if collected one. now optional and probably redundant.
   * @param {string}  [attackType=AttackType.NONE]    which type of attack is happened (according to detector).
   * @param {string}  [severity=Severity.LOW]         what level of severity attack was (according to detector).
   * @param {string}  [verdict=Verdict.CLEAN]         what type of verdict was reached (according to detector).
   * @param {string}  [segment=""]                    where injection was detected (according to detector).
   */
  constructor(
    sessionId: string,
    userIp: string | undefined,
    attackType: string = AttackType.NONE,
    severity: string = Severity.LOW,
    //   happenedAt: string
    verdict: string = Verdict.CLEAN,
    segment: string = "",
  ) {
    this.sessionId = sessionId;
    this.userIp = userIp;
    this.attackType = attackType;
    this.severity = severity;
    this.verdict = verdict;
    this.segment = segment;
  }
}
