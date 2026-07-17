import { createHash } from "node:crypto";

import type { UserPrompt } from "../forms/prompt.ts";
import { appConfig } from "../config/config.ts";

/**
 * ...
 *
 * @param prompt what to hash (prompt).
 * @returns hash (as Base64 string).
 */
export function hashUserPrompt(prompt: UserPrompt): string {
  const hash = createHash(appConfig.hashFunction);

  hash.update(JSON.stringify(prompt));

  return hash.digest("base64");
}
