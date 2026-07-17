import type { Request, Response, NextFunction } from "express";

import { failure, ResponseCodes, success } from "../helpers/response.ts";
import { PRMHelper } from "../helpers/storage/query-helper.ts";
import { logger } from "../logging/logger.ts";
import { isIpLoopback } from "../helpers/ip-is-loopback.ts";

/**
 * another middleware with descriptive name.
 *
 * checks db for existing prompt results.
 *
 * if one is found with related incidents, reports about reoccuring incident.
 */
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

    if (!req.userIp || isIpLoopback(req.userIp)) {
      logger.warn(
        `cannot retrieve ip for ${req.userPrompt.sessionId}, proceeding without their IP address.`,
      );

      // ensuring that userIp IS not set because of condition.
      req.userIp = undefined;
    }

    const foundUserPrompt = await PRMHelper.obtainPromptFromCache(
      req.userPromptHash,
    );

    if (!foundUserPrompt) {
      return next();
    }

    if (foundUserPrompt && !foundUserPrompt.get().incident) {
      // if prompt is found but it does not caused any incidents, then we just return it.
      const response = foundUserPrompt.get().promptResult;

      return success(res, {
        response,
      });
    }
    // assume that we have incident because previous check failed.
    const incident = foundUserPrompt.get().incident.get();

    logger
      .child(incident)
      .warn("incident reoccured, now displaying saved info...");

    return failure(res, ResponseCodes.INJECTION_DETECTED, {
      message: "prompt injection was detected",
      incident,
    });
  } catch (e) {
    logger.info(e);

    return failure(res, ResponseCodes.INTERNAL_ERR, {
      message: "internall error occured",
    });
  }
}
