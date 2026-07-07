import type { Request, Response } from "express";

import { failure, ResponseCodes, success } from "./helpers/response.ts";
import { logger } from "./logging/logger.ts";
import { ILMHelper } from "./helpers/storage/query-helper.ts";

export async function getIncidents(req: Request, res: Response) {
  try {
    const incidents = await ILMHelper.obtainIncidents();

    return success(res, { incidents });
  } catch (e) {
    logger.error(e);

    return failure(
      res,
      ResponseCodes.INTERNAL_ERR,
      "error occured while retriving incidents.",
    );
  }
}
