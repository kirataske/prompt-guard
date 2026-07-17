import type { UserPrompt } from "../forms/prompt.ts";

// extensions for request.
declare module "express" {
  interface Request {
    /** stored user prompt */
    userPrompt?: UserPrompt;
    /** calculated hash of prompt */
    userPromptHash?: string;

    // we can't be sure that IP is collected properly.
    /** stored user IP, if one was collected */
    userIp?: string | undefined;
  }
}
