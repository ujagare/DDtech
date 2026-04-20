const { Resend } = require("resend");
const {
  assertAllowedOrigin,
  assertBodySize,
  assertJsonRequest,
} = require("../lib/request-security");

module.exports = async (req, res) => {
  if (process.env.ENABLE_EMAIL_TEST_ENDPOINTS !== "true") {
    return res.status(404).json({ error: "Not found" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    assertAllowedOrigin(req.headers);
    assertJsonRequest(req.headers);
    assertBodySize(req.headers, typeof req.body === "string" ? req.body : JSON.stringify(req.body || {}));
  } catch (error) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(error.statusCode || 500).json({ error: error.message || "Invalid request" });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: "RESEND_API_KEY is not configured" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const toEmail = process.env.RESEND_TO_EMAIL || "info@ddtech.in";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "DD Tech <noreply@ddtech.in>";

    const emailResponse = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: "DD Tech test email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7d0a0a;">DD Tech email test</h1>
          <p>This message confirms the configured Resend integration is working.</p>
          <p>Sent at: ${new Date().toISOString()}</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Test email sent successfully",
      emailId: emailResponse.id,
    });
  } catch (error) {
    console.error("Test email error:", error);
    return res.status(500).json({ error: "Failed to send test email" });
  }
};
