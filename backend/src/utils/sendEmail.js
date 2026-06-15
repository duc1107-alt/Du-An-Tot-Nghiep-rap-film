const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Check if configuration exists, otherwise fallback to logging
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('mock_')) {
      console.log('---------------- MOCK EMAIL SENT ----------------');
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`Message: \n${options.text || options.html}`);
      console.log('--------------------------------------------------');
      return { success: true, message: 'Mock email printed to console successfully.' };
    }

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Movie Ticket Booking" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    // Return mock success in development to prevent API crashes
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
