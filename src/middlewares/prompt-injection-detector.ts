import type { NextFunction, Request, Response } from "express";

import type { IncidentLog } from "../logging/incident.ts";

import { analyzePrompt, isIncidentSevere } from "../helpers/prompt-analyzer.ts";
import { failure, ResponseCodes } from "../helpers/response.ts";
import { PRMHelper } from "../helpers/storage/query-helper.ts";
import { isIpLoopback } from "../helpers/ip-is-loopback.ts";
import { logger } from "../logging/logger.ts";

export async function analyzePromptMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.userPrompt || !req.userPromptHash) {
      return failure(res, ResponseCodes.BAD_REQUEST, {
        message: "user prompt either was not saved properly.",
      });
    }

    if (!req.userIp || isIpLoopback(req.userIp)) {
      logger.warn(
        `cannot retrieve ip for ${req.userPrompt.sessionId}, proceeding without their IP address.`,
      );

      // ensuring that userIp IS not set because of condition.
      req.userIp = undefined;
    }

    const incident: IncidentLog = await analyzePrompt(
      req.userPrompt,
      req.userIp,
    );

    const incidentSevere: boolean = isIncidentSevere(incident);

    if (!incidentSevere) return next();

    await PRMHelper.cachePromptWIncident({
      calculatedHash: req.userPromptHash,
      promptResult: "",
      incident,
    });

    return failure(res, ResponseCodes.INJECTION_DETECTED, {
      message: "prompt injection was detected",
      incident,
    });
  } catch (e) {
    logger.error(e);

    return failure(res, ResponseCodes.INTERNAL_ERR, {
      message: "cannot analyze prompt, try later",
    });
  }
}
