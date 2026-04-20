module.exports = async (_req, res) => {
  return res.status(200).json({
    status: "ok",
    platform: "vercel",
    testEndpointsEnabled: process.env.ENABLE_EMAIL_TEST_ENDPOINTS === "true",
  });
};
