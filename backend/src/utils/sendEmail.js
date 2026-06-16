require('dotenv').config();
const nodemailer = require('nodemailer');

const smtpHost = process.env.SMTP_HOST || process.env.EMAIL_HOST;
const smtpPort = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587', 10);
const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
const smtpSecure = (process.env.SMTP_SECURE || process.env.EMAIL_SECURE || 'false').toLowerCase() === 'true';

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
});

async function sendEmail({ to, subject, html, text }) {
  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log('Email skipped because SMTP config is not fully set.');
    console.log({ to, subject, text, html: html ? html.slice(0, 200) : undefined });
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text: text || 'Please view this email in an HTML-capable client.',
    html,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
