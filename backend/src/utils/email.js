const nodemailer = require("nodemailer");

const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || "587", 10);
const EMAIL_USER = process.env.EMAIL_USER || "";
const EMAIL_PASS = process.env.EMAIL_PASS || "";
const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3001";

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_PORT === 465,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }
  return transporter;
}

async function sendPasswordResetEmail(toEmail, token) {
  const resetUrl = `${FRONTEND_URL}/frontend/reset-password/${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; max-width: 560px; margin: 0 auto; padding: 24px;">
      <h2 style="margin: 0 0 12px; font-size: 20px; color: #0a0e1a;">Reset your AquaLife password</h2>
      <p style="margin: 0 0 16px; font-size: 14px; color: #374151;">You requested to reset your password. Click the button below to set a new password. This link will expire soon.</p>
      <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg,#2d9cdb,#4dd9e8); color: #fff; padding: 12px 20px; border-radius: 10px; text-decoration: none; font-weight: 600;">Reset Password</a>
      <p style="margin: 16px 0 0; font-size: 12px; color: #6b7280;">If you did not request this, you can safely ignore this email.</p>
    </div>
  `;

  const info = await getTransporter().sendMail({
    from: EMAIL_FROM,
    to: toEmail,
    subject: "Reset your AquaLife password",
    html,
  });

  return info;
}

module.exports = {
  sendPasswordResetEmail,
};
