const { Resend } = require("resend");

async function sendTestEmailToInfo() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@send.ddtech.in";
  const toEmail = process.env.RESEND_TO_EMAIL || "info@ddtech.in";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resend = new Resend(apiKey);

  console.log(`Sending test email to ${toEmail}...`);

  const emailResponse = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    subject: "DD TECH test email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7d0a0a;">DD TECH email test</h1>
        <p>This confirms the current Resend configuration is working.</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      </div>
    `,
  });

  console.log("Email sent successfully.");
  console.log("Email ID:", emailResponse.id);
  return emailResponse;
}

if (require.main === module) {
  sendTestEmailToInfo()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Test failed:", error.message);
      process.exit(1);
    });
}

module.exports = sendTestEmailToInfo;
