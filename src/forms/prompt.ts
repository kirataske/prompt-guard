import z, { ZodObject } from "zod";

import { appConfig } from "../config/config.ts";

export const UserPromptScheme = z.object({
  userIp: z.ipv4(),
  prompt: z
    .string()
    .nonempty({ error: "empty prompt" })
    .max(appConfig.promptSymbolsMaxCount),
});

export type UserPrompt = z.infer<typeof UserPromptScheme>;
