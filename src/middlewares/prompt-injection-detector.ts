import type { NextFunction, Request, Response } from "express";
import { flattenError, ZodError } from "zod";

import { analyzePrompt, isIncidentSevere } from "../helpers/prompt-analyzer.ts";
import { PromptResultModel } from "../helpers/storage/prompts-model.ts";
import { IncidentLogModel } from "../helpers/storage/log-model.ts";
import { failure, ResponseCodes } from "../helpers/response.ts";
import type { IncidentLog } from "../logging/incident.ts";
import { logger } from "../logging/logger.ts";

export async function analyzePromptMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.userPrompt) {
      return failure(res, ResponseCodes.BAD_REQUEST, {
        message: "user prompt either was not saved or is absent.",
      });
    }

    const potentialIncident: IncidentLog = await analyzePrompt(
      req.userPrompt?.userIp,
    );

    const incidentSevere: boolean = isIncidentSevere(potentialIncident);

    if (!incidentSevere) return next();

    await PromptResultModel.create(
      {
        calculatedHash: req.userPromptHash,
        promptResult: "",
        incident: {
          userIp: potentialIncident.userIp,
          severity: potentialIncident.severity,
          attackType: potentialIncident.attackType,
          verdict: potentialIncident.verdict,
          segment: potentialIncident.segment,
        },
      },
      {
        include: [IncidentLogModel],
      },
    );

    return failure(res, ResponseCodes.INJECTION_DETECTED, {
      message: "prompt injection was detected",
      incident: potentialIncident,
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
