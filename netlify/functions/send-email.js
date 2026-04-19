const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { full_name, phone, requirement_type, project_location, message } =
      JSON.parse(event.body);

    // Validate required fields
    if (!full_name || !phone || !requirement_type || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // Send email to DD Tech
    const emailResponse = await resend.emails.send({
      from: "noreply@ddtech.in",
      to: "Info@ddtech.in",
      replyTo: phone,
      subject: `New Inquiry: ${requirement_type} - ${full_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7d0a0a; border-bottom: 2px solid #7d0a0a; padding-bottom: 10px;">New Inquiry from Website</h2>
          
          <div style="margin: 20px 0;">
            <p><strong>Name:</strong> ${full_name}</p>
            <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
            <p><strong>Requirement Type:</strong> ${requirement_type}</p>
            <p><strong>Project Location:</strong> ${project_location || "Not specified"}</p>
          </div>

          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #7d0a0a;">Message / Technical Details:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>

          <div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 20px; font-size: 12px; color: #666;">
            <p>This email was sent from your website contact form.</p>
            <p>Website: www.ddtech.in</p>
          </div>
        </div>
      `,
    });

    // Send confirmation email to user
    await resend.emails.send({
      from: "noreply@ddtech.in",
      to: phone,
      subject: "We received your inquiry - DD Tech",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7d0a0a;">Thank You for Contacting DD Tech</h2>
          
          <p>Hi ${full_name},</p>
          
          <p>We have received your inquiry regarding <strong>${requirement_type}</strong> for your project in <strong>${project_location || "your location"}</strong>.</p>
          
          <p>Our team will review your requirements and get back to you within <strong>48 hours</strong> at <strong>${phone}</strong>.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #7d0a0a;">Your Inquiry Details:</h3>
            <p><strong>Requirement:</strong> ${requirement_type}</p>
            <p><strong>Location:</strong> ${project_location || "Not specified"}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>

          <p>If you need immediate assistance, feel free to call us:</p>
          <ul>
            <li><a href="tel:+917821925836">+91 7821925836</a></li>
            <li><a href="tel:+919767164151">+91 9767164151</a></li>
            <li><a href="tel:+918669110052">+91 8669110052</a></li>
          </ul>

          <p>Best regards,<br/><strong>DD Tech Infrastructure</strong><br/>
          Sunrise Industrial Park, Nighoje, Pune<br/>
          <a href="https://www.ddtech.in">www.ddtech.in</a></p>
        </div>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Email sent successfully",
        id: emailResponse.id,
      }),
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to send email",
        details: error.message,
      }),
    };
  }
};
