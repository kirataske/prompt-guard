import type { Request, Response } from "express";

import { failure, ResponseCodes } from "./helpers/response.ts";
import { logger } from "./logging/logger.ts";

export async function getIncidents(req: Request, res: Response) {
  try {
    // return success(res, {
    //   incidents: await logModel.findAll({
    //     attributes: { exclude: ["createdAt", "updatedAt"] },
    //   }),
    // });
  } catch (e) {
    logger.error(e);

    return failure(
      res,
      ResponseCodes.INTERNAL_ERR,
      "error occured while retriving incidents.",
    );
  }
}
