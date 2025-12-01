// lib/email.ts
import nodemailer from "nodemailer";

// Create the email transporter (this connects to your email service)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Function to send password reset email
export async function sendPasswordResetEmail({
  to,
  resetUrl,
  userName,
}: {
  to: string;
  resetUrl: string;
  userName?: string;
}) {
  // HTML version of the email
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #111827;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: #f9fafb;
            padding: 30px;
            border-radius: 0 0 5px 5px;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #111827;
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>NEXUS</h1>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            ${userName ? `<p>Hi ${userName},</p>` : "<p>Hi,</p>"}
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #2563eb; font-size: 14px;">${resetUrl}</p>
            <p style="color: #dc2626;"><strong>⏰ This link will expire in 1 hour.</strong></p>
            <p style="color: #6b7280; font-size: 14px;">If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} NEXUS. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Plain text version (fallback for email clients that don't support HTML)
  const text = `
Reset Your Password - NEXUS

${userName ? `Hi ${userName},` : "Hi,"}

We received a request to reset your password. Click the link below to create a new password:

${resetUrl}

⏰ This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email.

© ${new Date().getFullYear()} NEXUS. All rights reserved.
  `;

  try {
    // Send the email
    const info = await transporter.sendMail({
      from: `"NEXUS" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: to,
      subject: "Reset Your Password - NEXUS",
      text: text,
      html: html,
    });

    console.log("✅ Password reset email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    throw error;
  }
}
