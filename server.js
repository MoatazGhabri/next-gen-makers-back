const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 5000;

// Allowed origins for CORS
const allowedOrigins = ["https://next-gen-makers.onrender.com"];

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

// Nodemailer Transport Configuration
const contactEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "moatazghabri@gmail.com", // Use environment variable or fallback
    pass: process.env.EMAIL_PASS || "dqkkbjwvpugivxen",       // Use environment variable or fallback
  },
});

// Verify Email Transporter
contactEmail.verify((error) => {
  if (error) {
    console.error("Email verification error:", error);
  } else {
    console.log("Ready to Send Emails");
  }
});

// Contact Route
app.post("/contact", (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const mail = {
    from: `${firstName} ${lastName} <${email}>`,
    to: process.env.EMAIL_USER || "moatazghabri@gmail.com",
    subject: `Nouveau message de ${firstName} ${lastName}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; border: 2px solid #3498db; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #3498db; text-align: center; padding: 10px; border-radius: 5px;">Nouveau Message</h2>
        <p><strong>Nom:</strong> ${firstName}</p>
        <p><strong>Prénom:</strong> ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Téléphone:</strong> ${phone || "N/A"}</p>
        <p><strong>Message:</strong><br>${message}</p>
        <h2 style="background-color: #3498db; color: white; text-align: center; padding: 10px; border-radius: 5px;">© NGM</h2>
      </div>
    `,
  };

  contactEmail.sendMail(mail, (error) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: "Failed to send the message" });
    }
    res.status(200).json({ message: "Message sent successfully" });
  });
});

// Default Route
app.get("/", (req, res) => {
  res.send("Email server is running");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
