import type { UserPrompt } from "../forms/prompt.ts";

// extensions for request.
declare module "express" {
  interface Request {
    // stores parsed user prompt;
    userPrompt?: UserPrompt;
    // stores precalculated hash of prompt
    userPromptHash?: string;

    // we can't be sure that IP is collected properly.
    userIp?: string | undefined;
  }
}
