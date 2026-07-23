const nodemailer = require("nodemailer");
require('dotenv').config();

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  family: 4,              // ✅ Force IPv4 — IPv6 wala error fix hoga
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false  // ✅ TLS certificate issue fix
  }
});

// Connection verify karo — pata chalega issue kahan hai
transport.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Connection Failed:", error.message);
  } else {
    console.log("✅ SMTP Connected! Ready to send emails.");
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transport.sendMail({
      from: `"Contact App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;