import type { Request, Response, NextFunction } from "express";
import { flattenError, ZodError } from "zod";

import { UserPromptScheme, type UserPrompt } from "../forms/prompt.ts";
import { failure, ResponseCodes } from "../helpers/response.ts";
import { hashUserPrompt } from "../helpers/hash.ts";
import { logger } from "../logging/logger.ts";

/**
 * middleware thats... well... parses body?
 *
 * uses ZodSchema to parse and validate user form..
 * also collects user's IP if possible.
 */
export function parseBody(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed: UserPrompt = UserPromptScheme.parse(req.body);

    // let's assume that ip address is always sent by client
    // BUT how it would be trustworthy,
    // if request is sent from the same spot where proxy hosted
    // we'll eventually get loopback address.
    // gladly, userIp isn't used in hash calculations anymore
    // it's replaced with session ID - unique UUIDv4 string.
    // TODO: decide the fate of userIp.
    const userIp: string | undefined = req.userIp;

    req.userIp = userIp;
    req.userPrompt = parsed;
    req.userPromptHash = hashUserPrompt(parsed);

    next();
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
      message: "internal err occured",
    });
  }
}
