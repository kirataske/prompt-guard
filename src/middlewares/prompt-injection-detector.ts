import type { NextFunction, Request, Response } from "express";
import { flattenError, ZodError } from "zod";

import { analyzePrompt, isIncidentSevere } from "../helpers/prompt-analyzer.ts";
import { UserPromptScheme, type UserPrompt } from "../forms/prompt.ts";
import { failure, ResponseCodes } from "../helpers/response.ts";
import { IncidentLogger } from "../logging/incident-logger.ts";
import type { IncidentLog } from "../logging/incident.ts";
import { logger } from "../logging/logger.ts";

export async function analyzePromptMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed: UserPrompt = UserPromptScheme.parse(req.body);

    const potentialIncident: IncidentLog = await analyzePrompt();

    const incidentSevere: boolean = isIncidentSevere(potentialIncident);

    if (!incidentSevere) return next();

    const actualIncident =
      await IncidentLogger.reportAndSave(potentialIncident);

    return failure(res, ResponseCodes.INJECTION_DETECTED, {
      message: "prompt injection was detected",
      incident: actualIncident,
    });
  } catch (e) {
    if (e instanceof ZodError) {
      const flattenedError = flattenError(e);

      return failure(res, ResponseCodes.BAD_REQUEST, {
        message: "invalid form",
        ...flattenedError,
      });
    }

    logger.error(e);

    return failure(res, ResponseCodes.INTERNAL_ERR, {
      message: "cannot analyze prompt, try later",
    });
  }
}
