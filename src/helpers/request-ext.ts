import type { UserPrompt } from "../forms/prompt.ts";

// extensions for request.
declare module "express" {
  interface Request {
    // stores parsed user prompt;
    userPrompt?: UserPrompt;
    // stores precalculated hash of prompt
    userPromptHash?: string;
  }
}
