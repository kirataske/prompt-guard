import type { Request, Response } from "express";

import { logger } from "./logging/logger.ts";
import { failure, success, ResponseCodes } from "./helpers/response.ts";
import { logDbModel } from "./helpers/storage/db.ts";

export async function getIncidents(req: Request, res: Response) {
  try {
    return success(res, {
      incidents: await logDbModel.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      }),
    });
  } catch (e) {
    logger.error(e);

    return failure(
      res,
      ResponseCodes.INTERNAL_ERR,
      "error occured while retriving incidents.",
    );
  }
}
