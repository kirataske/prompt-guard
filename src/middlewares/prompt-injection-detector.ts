import type { NextFunction, Request, Response } from "express";

export function analyzePrompt(req: Request, res: Response, next: NextFunction) {
  next();
}
