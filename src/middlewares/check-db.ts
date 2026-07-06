import type { Request, Response, NextFunction } from "express";

import { failure, ResponseCodes, success } from "../helpers/response.ts";
import { PromptResultModel } from "../helpers/storage/prompts-model.ts";
import { IncidentLogModel } from "../helpers/storage/log-model.ts";
import { logger } from "../logging/logger.ts";

export async function lookupDb(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.userPrompt || !req.userPromptHash) {
      return failure(res, ResponseCodes.BAD_REQUEST, {
        message: "user prompt either was not saved or is absent.",
      });
    }

    const foundUserPrompt = await PromptResultModel.findOne({
      where: {
        calculatedHash: req.userPromptHash,
      },
      include: [IncidentLogModel],
    });

    if (!foundUserPrompt) {
      return next();
    } else if (foundUserPrompt && !foundUserPrompt.get().incident) {
      // if incident is found but it not caused incident, then we just return it.
      return success(res, {
        response: foundUserPrompt.get().promptResult,
      });
    } else {
      // assume that we have incident because previous check failed.

      return failure(res, ResponseCodes.INJECTION_DETECTED, {
        message: "prompt injection was detected",
        incident: foundUserPrompt.get().incident.get(),
      });
    }
  } catch (e) {
    logger.info(e);

    return failure(res, ResponseCodes.INTERNAL_ERR, {
      message: "internall error occured",
    });
  }
}
