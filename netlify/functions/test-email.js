const { Resend } = require("resend");

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

  if (process.env.ENABLE_EMAIL_TEST_ENDPOINTS !== "true") {
    return jsonResponse(404, { error: "Not found" });
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  if (!process.env.RESEND_API_KEY) {
    return jsonResponse(500, { error: "RESEND_API_KEY is not configured" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const toEmail = process.env.RESEND_TO_EMAIL || "info@ddtech.in";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@ddtech.in";

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

    return jsonResponse(200, {
      success: true,
      message: "Test email sent successfully",
      emailId: emailResponse.id,
    });
  } catch (error) {
    console.error("Test email error:", error);
    return jsonResponse(500, {
      error: "Failed to send test email",
    });
  }
};
