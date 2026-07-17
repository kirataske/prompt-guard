import type { Request, Response } from "express";

import { failure, ResponseCodes, success } from "./helpers/response.ts";
import { ILMHelper } from "./helpers/storage/query-helper.ts";
import { logger } from "./logging/logger.ts";

/**
 * returns all occured incidents.
 *
 * sadly, client should paginate them at it's side.
 */
export async function getIncidents(req: Request, res: Response) {
  try {
    const incidents = await ILMHelper.obtainIncidents();

    return success(res, { incidents });
  } catch (e) {
    logger.error(e);

    return failure(res, ResponseCodes.INTERNAL_ERR, {
      message: "error occured while retriving incidents.",
    });
  }
}
