import { type Response } from "express";

const BadResCodes = {
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  INJECTION_DETECTED: 403,
  INTERNAL_ERR: 500,
};

const responseAppCodes: Map<number, string> = new Map([
  [BadResCodes.BAD_REQUEST, "invalid_form"],
  [BadResCodes.FORBIDDEN, "resource_forbidden"],
  [BadResCodes.INJECTION_DETECTED, "injection_detected"],
  [BadResCodes.INTERNAL_ERR, "internal_err_occured"],
]);

export function success<T>(res: Response, data: T): Response {
  return res.status(200).send({ status: "ok", ...data });
}

export function failure<T>(
  res: Response,
  status: number = BadResCodes.BAD_REQUEST,
  data: T,
): Response {
  return res.status(status).send({
    status: responseAppCodes.get(status),
    ...data,
  });
}

export { BadResCodes as ResponseCodes };
