require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sendEmailHandler = require("./api/send-email");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("."));

// Routes
app.post("/api/send-email", sendEmailHandler);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(
    `📧 Email API endpoint: POST http://localhost:${PORT}/api/send-email`,
  );
});
