const loopbackValues = ["127.0.0.1", "::1", "::1:127.0.0.1"];

export function isIpLoopback(ip: string) {
  return ip in loopbackValues;
}
