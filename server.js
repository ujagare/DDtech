require("dotenv").config();

const cors = require("cors");
const express = require("express");

const sendEmailHandler = require("./api/send-email");
const testEmailHandler = require("./api/test-email");

const app = express();
const PORT = process.env.PORT || 3000;
const enableTestEndpoints = process.env.ENABLE_EMAIL_TEST_ENDPOINTS === "true";

app.use(cors());
app.use(express.json());
app.use(express.static("."));

app.post("/api/send-email", sendEmailHandler);

if (enableTestEndpoints) {
  app.post("/api/test-email", testEmailHandler);

  app.get("/api/test-email-quick", async (_req, res) => {
    try {
      await testEmailHandler({ method: "POST", body: {} }, res);
      if (!res.headersSent) {
        res.json({ message: "Check your configured inbox for the test email." });
      }
    } catch (error) {
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      }
    }
  });
}

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    testEndpointsEnabled: enableTestEndpoints,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Contact email endpoint: POST http://localhost:${PORT}/api/send-email`);

  if (enableTestEndpoints) {
    console.log(`Test email endpoint: POST http://localhost:${PORT}/api/test-email`);
    console.log(`Quick test endpoint: GET http://localhost:${PORT}/api/test-email-quick`);
  }
});
