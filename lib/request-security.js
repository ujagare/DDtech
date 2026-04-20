const MAX_JSON_BODY_BYTES = 16 * 1024;

function getHeader(headers, name) {
  if (!headers || typeof headers !== "object") {
    return "";
  }

  const headerName = name.toLowerCase();

  for (const [key, value] of Object.entries(headers)) {
    if (String(key).toLowerCase() === headerName) {
      return Array.isArray(value) ? String(value[0] || "") : String(value || "");
    }
  }

  return "";
}

function getAllowedOrigins() {
  const configured = String(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const defaults = [
    "https://ddtech.in",
    "https://www.ddtech.in",
  ];

  if (process.env.VERCEL_URL) {
    defaults.push(`https://${process.env.VERCEL_URL}`);
  }

  return [...new Set([...defaults, ...configured])];
}

function assertAllowedOrigin(headers) {
  const origin = getHeader(headers, "origin");
  const referer = getHeader(headers, "referer");
  const allowedOrigins = getAllowedOrigins();

  if (!origin && !referer) {
    return;
  }

  const matchesAllowedOrigin = (value) =>
    allowedOrigins.some((allowedOrigin) => value.startsWith(allowedOrigin));

  if ((origin && !matchesAllowedOrigin(origin)) || (referer && !matchesAllowedOrigin(referer))) {
    const error = new Error("Forbidden origin");
    error.statusCode = 403;
    throw error;
  }
}

function assertJsonRequest(headers) {
  const contentType = getHeader(headers, "content-type").toLowerCase();

  if (!contentType.includes("application/json")) {
    const error = new Error("Content-Type must be application/json");
    error.statusCode = 415;
    throw error;
  }
}

function assertBodySize(headers, rawBody) {
  const contentLength = Number.parseInt(getHeader(headers, "content-length"), 10);

  if (Number.isFinite(contentLength) && contentLength > MAX_JSON_BODY_BYTES) {
    const error = new Error("Request body is too large");
    error.statusCode = 413;
    throw error;
  }

  if (typeof rawBody === "string" && Buffer.byteLength(rawBody, "utf8") > MAX_JSON_BODY_BYTES) {
    const error = new Error("Request body is too large");
    error.statusCode = 413;
    throw error;
  }
}

function parseJsonBody(rawBody) {
  if (!rawBody) {
    return {};
  }

  if (typeof rawBody === "object") {
    return rawBody;
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    const error = new Error("Invalid JSON payload");
    error.statusCode = 400;
    throw error;
  }
}

module.exports = {
  MAX_JSON_BODY_BYTES,
  assertAllowedOrigin,
  assertBodySize,
  assertJsonRequest,
  parseJsonBody,
};
