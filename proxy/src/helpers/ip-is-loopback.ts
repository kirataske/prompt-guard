const loopbackValues = ["127.0.0.1", "::1", "::1:127.0.0.1"];

/**
 * checks if provided IP is loopback.
 *
 * it helps to not fill records about incidents with loopback IPs.
 * @param ip to check.
 * @returns {boolean} if its loopback or not.
 */
export function isIpLoopback(ip: string) {
  return loopbackValues.includes(ip);
}
