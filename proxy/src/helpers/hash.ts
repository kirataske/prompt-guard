import { createHash } from "node:crypto";

import type { UserPrompt } from "../forms/prompt.ts";
import { appConfig } from "../config/config.ts";

export function hashUserPrompt(prompt: UserPrompt): string {
  const hash = createHash(appConfig.hashFunction);

  hash.update(JSON.stringify(prompt));

  return hash.digest("base64");
}
