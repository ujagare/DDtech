const { sendContactEmail } = require("../../lib/contact-email");
const {
  assertAllowedOrigin,
  assertBodySize,
  assertJsonRequest,
  parseJsonBody,
} = require("../../lib/request-security");

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(payload),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  try {
    assertAllowedOrigin(event.headers);
    assertJsonRequest(event.headers);
    assertBodySize(event.headers, event.body || "");

    const payload = parseJsonBody(event.body);
    const result = await sendContactEmail(payload);

    return jsonResponse(200, {
      success: true,
      message: "Inquiry sent successfully",
      id: result.id || null,
    });
  } catch (error) {
    console.error("Contact email error:", error);

    return jsonResponse(error.statusCode || 500, {
      error:
        error.statusCode && error.statusCode < 500
          ? error.message
          : "Unable to send inquiry right now. Please try again shortly.",
    });
  }
};
