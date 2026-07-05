// TODO: waiting for format establishment.
export const AttackType = {
  NONE: "none",
  DIRECT_INJECTION: "direct_injection",
  INDIRECT_RAG: "indirect_rag",
  SYS_PROMPT_LEAK: "system_prompt_leak",
  RP_BYPASS: "role_play_bypass",
  OBFUSCATION: "obfuscation",
  PAYLOAD_SPLIT: "payload_split",
};

// TODO: same for verdict;
export const Verdict = {
  VALID: "valid",
  SUSPICIOUS: "suspicious",
  BLOCKED: "blocked",
};

export const Severity = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

export class IncidentLog {
  public userIp: string;
  public attackType: string;
  public severity: string;
  //   happenedAt: string
  public verdict: string;
  public segment: string;
  constructor(
    userIp: string,
    attackType: string = AttackType.NONE,
    severity: string = Severity.LOW,
    //   happenedAt: string
    verdict: string = Verdict.VALID,
    segment: string = "",
  ) {
    this.userIp = userIp;
    this.attackType = attackType;
    this.severity = severity;
    this.verdict = verdict;
    this.segment = segment;
  }
}
