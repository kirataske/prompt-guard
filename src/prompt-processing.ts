import type { Request, Response } from "express";
import { flattenError, ZodError } from "zod";

import { UserPromptScheme, type UserPrompt } from "./forms/prompt.ts";
import { generateContent } from "./config/gen-ai.ts";

export async function processPrompt(req: Request, res: Response) {
  try {
    const parsed: UserPrompt = UserPromptScheme.parse(req.body);

    const generated = await generateContent(parsed.prompt);

    return res.status(200).send({ status: "ok", response: generated.text });
  } catch (e) {
    if (e instanceof ZodError) {
      const flattenedError = flattenError(e);

      return res
        .status(400)
        .send({ message: "invalid form", ...flattenedError });
    }

    return res
      .status(500)
      .send({ message: "error occured while processing prompt" });
  }
}
