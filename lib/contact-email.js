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
  const fromEmail = process.env.RESEND_FROM_EMAIL || "DD Tech <noreply@ddtech.in>";
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
    subject: "We received your inquiry - DD Tech",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
        <h2 style="color: #7d0a0a;">Thank You for Contacting DD Tech</h2>
        <p>Hi ${fullName},</p>
        <p>
          We have received your inquiry regarding <strong>${requirementType}</strong>
          for your project in <strong>${projectLocation}</strong>.
        </p>
        <p>
          Our team will review your requirements and get back to you within
          <strong>48 hours</strong>.
        </p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #7d0a0a;">Your Inquiry Details</h3>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Requirement:</strong> ${requirementType}</p>
          <p><strong>Location:</strong> ${projectLocation}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
        <p>If you need immediate assistance, feel free to call us:</p>
        <ul>
          <li><a href="tel:+917821925836">+91 7821925836</a></li>
          <li><a href="tel:+919767164151">+91 97671 64151</a></li>
          <li><a href="tel:+918669110052">+91 8669110052</a></li>
        </ul>
        <p>
          Best regards,<br />
          <strong>DD Tech Infrastructure</strong><br />
          Sunrise Industrial Park, Nighoje, Pune<br />
          <a href="https://www.ddtech.in">www.ddtech.in</a>
        </p>
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
