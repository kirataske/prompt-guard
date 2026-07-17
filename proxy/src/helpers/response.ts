import { type Response } from "express";

/**
 * kind of [internal] enumeration that contains used HTTP error codes.
 *
 * (or should I call it "shortcuts"?).
 */
const BadResCodes = {
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  INJECTION_DETECTED: 403,
  INTERNAL_ERR: 500,
};

/**
 * [internal] translation of error codes to meaningful string values.
 */
const responseAppCodes: Map<number, string> = new Map([
  [BadResCodes.BAD_REQUEST, "invalid_form"],
  [BadResCodes.FORBIDDEN, "resource_forbidden"],
  [BadResCodes.INJECTION_DETECTED, "injection_detected"],
  [BadResCodes.INTERNAL_ERR, "internal_err_occured"],
]);

/**
 * returns ANYTHING provided into it with HTTP status code 200 (`OK`).
 *
 * note: generics usage is a hack for not writing `any` as `data` type.
 * @param res   Express's Response object, used for... well... sending responses?
 * @param data  mentioned ANYTHING you should provide.
 * @returns
 */
export function success<T>(res: Response, data: T): Response {
  return res.status(200).send({ status: "ok", ...data });
}

/**
 * same deal as `success`, but when someting bad occured.
 *
 * note: generics here for same reason as for `success`
 * @param res     Express's Response object, used for... well... sending responses?
 * @param status  should use `BadResCodes` values (that imported as `ResponseCodes` for some reason).
 * @param data    ANYTHING related to bad thing that happened.
 * @returns
 */
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

// this is result of Codium shenanigans when I tried to rename variable.
// but I'm not willing to fix this.
export { BadResCodes as ResponseCodes };
