const nodemailer = require('nodemailer');

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    console.warn('SMTP credentials not fully configured. Emails will be logged instead of sent.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465, // true for 465, false for other ports
    auth: { user, pass },
  });
};

const transporter = createTransporter();

module.exports = async function sendEmail({ to, subject, text = '', html = '' }) {
  if (!to) throw new Error('Missing "to" address for sendEmail');

  if (!transporter) {
    console.log('Send email (logged) ->', { to, subject });
    return Promise.resolve({ logged: true });
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId || info.accepted);
    return info;
  } catch (err) {
    console.error('Email send failed:', err);
    throw err;
  }
};
