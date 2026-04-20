const { sendContactEmail } = require("../lib/contact-email");
const {
  assertAllowedOrigin,
  assertBodySize,
  assertJsonRequest,
  parseJsonBody,
} = require("../lib/request-security");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    assertAllowedOrigin(req.headers);
    assertJsonRequest(req.headers);
    assertBodySize(req.headers, typeof req.body === "string" ? req.body : JSON.stringify(req.body || {}));

    const payload = parseJsonBody(req.body);
    const result = await sendContactEmail(payload);

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      success: true,
      message: "Inquiry sent successfully",
      id: result.id || null,
    });
  } catch (error) {
    console.error("Contact email error:", error);

    res.setHeader("Cache-Control", "no-store");
    return res.status(error.statusCode || 500).json({
      error:
        error.statusCode && error.statusCode < 500
          ? error.message
          : "Unable to send inquiry right now. Please try again shortly.",
    });
  }
};
