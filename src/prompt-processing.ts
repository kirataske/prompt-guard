import { type Request, type Response } from "express";

import { UserPromptScheme, type UserPrompt } from "./forms/prompt.ts";
import { failure, success, ResponseCodes } from "./helpers/response.ts";
import { generateContent } from "./helpers/gen-ai.ts";

export async function processPrompt(req: Request, res: Response) {
  try {
    // TODO: use parsed data from middleware before.
    const parsed: UserPrompt = UserPromptScheme.parse(req.body);

    const generated = await generateContent(parsed.prompt);

    return success(res, { response: generated.text });
  } catch (_) {
    return failure(res, ResponseCodes.INTERNAL_ERR, {
      message: "error occured while processing prompt",
    });
  }
}
