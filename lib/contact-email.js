const { Resend } = require("resend");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d()\-\s]{7,20}$/;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeField(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "DD Tech <noreply@send.ddtech.in>";
  const toEmail = process.env.RESEND_TO_EMAIL || "info@ddtech.in";

  if (!apiKey) {
    const error = new Error("RESEND_API_KEY is not configured");
    error.statusCode = 500;
    throw error;
  }

  return {
    resend: new Resend(apiKey),
    fromEmail,
    toEmail,
  };
}

function validatePayload(payload) {
  const sanitized = {
    full_name: normalizeField(payload.full_name),
    email: normalizeField(payload.email).toLowerCase(),
    phone: normalizeField(payload.phone),
    requirement_type: normalizeField(payload.requirement_type),
    project_location: normalizeField(payload.project_location),
    message: normalizeField(payload.message),
    company: normalizeField(payload.company),
  };

  if (sanitized.company) {
    return { sanitized, isSpam: true };
  }

  if (
    !sanitized.full_name ||
    !sanitized.email ||
    !sanitized.phone ||
    !sanitized.requirement_type ||
    !sanitized.message
  ) {
    const error = new Error("Missing required fields");
    error.statusCode = 400;
    throw error;
  }

  if (!EMAIL_REGEX.test(sanitized.email)) {
    const error = new Error("Please enter a valid email address");
    error.statusCode = 400;
    throw error;
  }

  if (!PHONE_REGEX.test(sanitized.phone)) {
    const error = new Error("Please enter a valid phone number");
    error.statusCode = 400;
    throw error;
  }

  if (sanitized.message.length < 10 || sanitized.message.length > 3000) {
    const error = new Error("Message must be between 10 and 3000 characters");
    error.statusCode = 400;
    throw error;
  }

  if (sanitized.full_name.length > 120 || sanitized.project_location.length > 180) {
    const error = new Error("Submitted text is too long");
    error.statusCode = 400;
    throw error;
  }

  if (sanitized.requirement_type.length > 120) {
    const error = new Error("Requirement type is too long");
    error.statusCode = 400;
    throw error;
  }

  if (sanitized.phone.length > 20) {
    const error = new Error("Phone number is too long");
    error.statusCode = 400;
    throw error;
  }

  return { sanitized, isSpam: false };
}

async function sendContactEmail(payload) {
  const { sanitized, isSpam } = validatePayload(payload);

  // Silently accept likely bot submissions.
  if (isSpam) {
    return { success: true, skipped: true };
  }

  const { resend, fromEmail, toEmail } = getConfig();
  const fullName = escapeHtml(sanitized.full_name);
  const email = escapeHtml(sanitized.email);
  const phone = escapeHtml(sanitized.phone);
  const requirementType = escapeHtml(sanitized.requirement_type);
  const projectLocation = sanitized.project_location
    ? escapeHtml(sanitized.project_location)
    : "Not specified";
  const message = escapeHtml(sanitized.message);

  const internalEmail = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    replyTo: sanitized.email,
    subject: `New Inquiry: ${sanitized.requirement_type} - ${sanitized.full_name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
        <h2 style="color: #7d0a0a; border-bottom: 2px solid #7d0a0a; padding-bottom: 10px;">
          New Inquiry from Website
        </h2>
        <div style="margin: 20px 0;">
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
          <p><strong>Requirement Type:</strong> ${requirementType}</p>
          <p><strong>Project Location:</strong> ${projectLocation}</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #7d0a0a;">Message / Technical Details</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
        <div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 20px; font-size: 12px; color: #666;">
          <p>This email was sent from the DD Tech website contact form.</p>
          <p>Website: https://www.ddtech.in</p>
        </div>
      </div>
    `,
  });

  await resend.emails.send({
    from: fromEmail,
    to: [sanitized.email],
    replyTo: toEmail,
    subject: "Inquiry Received - DD Tech Infrastructure",
    html: `
      <div style="margin: 0; padding: 24px 0; background-color: #f3f1ee;">
        <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e6dfda;">
          <div style="background-color: #7d0a0a; padding: 28px 32px; color: #ffffff;">
            <div style="font-size: 12px; letter-spacing: 1.8px; text-transform: uppercase; opacity: 0.8;">DD Tech Infrastructure</div>
            <h2 style="margin: 10px 0 0; font-size: 26px; line-height: 1.3;">Thank you for your inquiry</h2>
          </div>
          <div style="padding: 32px;">
            <p style="margin: 0 0 16px; color: #1f2933; font-size: 15px; line-height: 1.7;">Dear ${fullName},</p>
            <p style="margin: 0 0 16px; color: #1f2933; font-size: 15px; line-height: 1.7;">
              Thank you for contacting <strong>DD Tech Infrastructure</strong>. We have successfully received your inquiry regarding
              <strong>${requirementType}</strong> for your project in <strong>${projectLocation}</strong>.
            </p>
            <p style="margin: 0 0 24px; color: #1f2933; font-size: 15px; line-height: 1.7;">
              Our team is reviewing the details shared by you and will connect with you within
              <strong>24 to 48 business hours</strong>.
            </p>
            <div style="margin: 0 0 24px; padding: 20px; background-color: #faf7f5; border: 1px solid #eadfd9;">
              <h3 style="margin: 0 0 14px; color: #7d0a0a; font-size: 16px;">Inquiry Summary</h3>
              <p style="margin: 0 0 8px; color: #374151; font-size: 14px;"><strong>Name:</strong> ${fullName}</p>
              <p style="margin: 0 0 8px; color: #374151; font-size: 14px;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 0 0 8px; color: #374151; font-size: 14px;"><strong>Phone:</strong> ${phone}</p>
              <p style="margin: 0 0 8px; color: #374151; font-size: 14px;"><strong>Requirement:</strong> ${requirementType}</p>
              <p style="margin: 0 0 8px; color: #374151; font-size: 14px;"><strong>Project Location:</strong> ${projectLocation}</p>
              <p style="margin: 14px 0 6px; color: #374151; font-size: 14px;"><strong>Message:</strong></p>
              <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="margin: 0 0 12px; color: #1f2933; font-size: 15px; line-height: 1.7;">
              For urgent requirements, you may contact our team directly:
            </p>
            <p style="margin: 0 0 24px; color: #1f2933; font-size: 15px; line-height: 1.9;">
              <a href="tel:+917821925836" style="color: #7d0a0a; text-decoration: none;">+91 7821925836</a><br />
              <a href="tel:+919767164151" style="color: #7d0a0a; text-decoration: none;">+91 97671 64151</a><br />
              <a href="tel:+918669110052" style="color: #7d0a0a; text-decoration: none;">+91 8669110052</a>
            </p>
            <p style="margin: 0 0 10px; color: #1f2933; font-size: 15px; line-height: 1.7;">Sincerely,</p>
            <p style="margin: 0; color: #1f2933; font-size: 15px; line-height: 1.7;">
              <strong>Team DD Tech Infrastructure</strong><br />
              Sunrise Industrial Park, Nighoje, Pune<br />
              <a href="mailto:${toEmail}" style="color: #7d0a0a; text-decoration: none;">${toEmail}</a><br />
              <a href="https://www.ddtech.in" style="color: #7d0a0a; text-decoration: none;">www.ddtech.in</a>
            </p>
          </div>
        </div>
      </div>
    `,
  });

  return {
    success: true,
    id: internalEmail.id,
  };
}

module.exports = {
  sendContactEmail,
};
