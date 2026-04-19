const { sendContactEmail } = require("../lib/contact-email");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await sendContactEmail(req.body || {});

    return res.status(200).json({
      success: true,
      message: "Inquiry sent successfully",
      id: result.id || null,
    });
  } catch (error) {
    console.error("Contact email error:", error);

    return res.status(error.statusCode || 500).json({
      error:
        error.statusCode && error.statusCode < 500
          ? error.message
          : "Unable to send inquiry right now. Please try again shortly.",
    });
  }
};
