const { sendContactEmail } = require("../../lib/contact-email");

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
    body: JSON.stringify(payload),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(200, { ok: true });
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  try {
    const payload = JSON.parse(event.body || "{}");
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
