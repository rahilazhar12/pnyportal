// emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rahil.azhar10@gmail.com',
        pass: 'kxfl vyti iamn jjre'
    }
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: 'rahil.azhar10@gmail.com',
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Notification email sent successfully.");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

const sendVerificationCodeEmail = async (email, code, userName) => {
    const mailOptions = {
        from: 'rahil.azhar10@gmail.com',
        to: email,
        subject: "Verification Code",
        html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <div style="text-align: center; padding-bottom: 20px;">
              <img src="https://pnygroup.co/wp-content/uploads/2021/11/235146443_1714244258779215_7609558304785368671_n-1.png" alt="PNY Job Portal Logo" style="width: 150px;"/>
          </div>
          <h2 style="color: #007bff; text-align: center;">Verification Code</h2>
          <p>Dear ${userName},</p>
          <p>Thank you for registering with the <strong>PNY Job Portal</strong>! To complete your registration and verify your email address, please use the verification code below:</p>
          <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 1.5em; color: #007bff; font-weight: bold;">${code}</span>
          </div>
          <p style="font-size: 0.9em; color: #666;">This code is valid for the next 15 minutes. If you did not create an account on the PNY Job Portal, please ignore this message.</p>
          <p style="margin-top: 30px;">We look forward to helping you on your journey to finding the perfect job.</p>
          <p style="color: #007bff; font-weight: bold;">Best regards,<br>The PNY Job Portal Team</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin-top: 30px;"/>
          <footer style="text-align: center; font-size: 0.8em; color: #999;">
              © 2024 PNY Job Portal, Inc. All rights reserved.
              <a href="https://www.pnytrainings.com/" style="color: #007bff; text-decoration: none;">Visit our website</a>
          </footer>
      </div>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully.");
    } catch (error) {
        console.error("Error sending verification email:", error);
    }
};


module.exports = { sendEmail, sendVerificationCodeEmail };
