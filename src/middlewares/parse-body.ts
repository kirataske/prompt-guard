import type { Request, Response, NextFunction } from "express";
import { flattenError, ZodError } from "zod";

import { UserPromptScheme, type UserPrompt } from "../forms/prompt.ts";
import { failure, ResponseCodes } from "../helpers/response.ts";
import { hashUserPrompt } from "../helpers/hash.ts";

export function parseBody(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed: UserPrompt = UserPromptScheme.parse(req.body);

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

    return failure(res, ResponseCodes.INTERNAL_ERR, {
      message: "internal err occured",
    });
  }
}
