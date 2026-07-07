import { type Request, type Response } from "express";

import { failure, success, ResponseCodes } from "./helpers/response.ts";
import { PromptResultModel } from "./helpers/storage/prompts-model.ts";
import { generateContent } from "./helpers/gen-ai.ts";
import { logger } from "./logging/logger.ts";

export async function processPrompt(req: Request, res: Response) {
  try {
    if (!req.userPrompt || !req.userPromptHash) {
      return failure(res, ResponseCodes.BAD_REQUEST, {
        message: "user prompt either was not saved or is absent.",
      });
    }

    const generated = await generateContent(req.userPrompt.prompt);

    await PromptResultModel.create({
      calculatedHash: req.userPromptHash,
      promptResult: generated.text,
    });

    return success(res, { response: generated.text });
  } catch (e) {
    logger.error(e);

    return failure(res, ResponseCodes.INTERNAL_ERR, {
      message: "error occured while processing prompt",
    });
  }
}
