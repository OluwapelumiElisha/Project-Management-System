const nodemailer = require("nodemailer");

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.usermail,
    pass: process.env.passkey,
  },
});

const sendWelcomeEmail = ({ email }) => {
  console.log( email);
  const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome ${email}</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
    }
    .email-wrapper {
        background-color: #ffffff;
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .email-header {
        background-color: #dc2626;
        color: #ffffff;
        padding: 10px;
        text-align: center;
    }
    .email-body {
        padding: 20px;
        text-align: center;
    }
    .email-footer {
        text-align: center;
        padding: 10px;
        font-size: 12px;
        color: #666;
    }
</style>
</head>
<body>
<div class="email-wrapper">
    <div class="email-header">
        <h1>Welcome to Project Management System! </h1>
    </div>
    <div class="email-body">
        <p>Hello <strong>${email}</strong>,</p>
        <p>Thank you for joining us! We are excited to have you on board and look forward to serving you.</p>
        <p>A project management system (PMS) is a set of tools, processes, and methodologies designed to plan, execute, and monitor projects efficiently and effectively. It provides a structured framework to manage various aspects of a project, including tasks, resources.</p>
        <p>Your Account is succefully Verify</p>
    </div>
    <div class="email-footer">
        Best regards,<br>
        https://github.com/OluwapelumiElisha
    </div>
</div>
</body>
</html>
`;

  const mailOptions = {
    from: process.env.usermail,
    to: email,
    subject: "Welcome to our website",
    html,
  };

  mailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const sendVerificationCode = ({ email, otp }) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome ${email}</title>
  <style>
  body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
  }
  .email-wrapper {
      background-color: #ffffff;
      width: 100%;
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  .email-header {
      background-color: #dc2626;
      color: #ffffff;
      padding: 10px;
      text-align: center;
  }
  .email-body {
      padding: 20px;
      text-align: center;
  }
  .email-footer {
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #666;
  }
  </style>
  </head>
  <body>
  <div class="email-wrapper">
  <div class="email-header">
      <h1>OTP Verification</h1>
  </div>
  <div class="email-body">
      <p>Hello <strong>${otp}</strong>,</p>
      <p>Thank you for joining us! We are excited to have you on board and look forward to serving you.</p>
      <p>This OTP will Expire within one hour</p>
  </div>
  <div class="email-footer">
      Best regards,<br>
      https://github.com/OluwapelumiElisha
  </div>
  </div>
  </body>
  </html>
  `;

  const mailOptions = {
    from: process.env.usermail,
    to: email,
    subject: "OTP verification code",
    html,
  };
  mailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
const sendNotice = ({ email }) => {
  // console.log( email);
  const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome ${email}</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
    }
    .email-wrapper {
        background-color: #ffffff;
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .email-header {
        background-color: #007bff;
        color: #ffffff;
        padding: 10px;
        text-align: center;
    }
    .email-body {
        padding: 20px;
        text-align: center;
    }
    .email-footer {
        text-align: center;
        padding: 10px;
        font-size: 12px;
        color: #666;
    }
</style>
</head>
<body>
<div class="email-wrapper">
    <div class="email-header">
        <h1>You Have Change Ur Password</h1>
    </div>
    <div class="email-body">
        <p>Hello <strong>${email}</strong>,</p>
        <p>Password Change Successfully....</p>
    </div>
  
</div>
</body>
</html>
`;

  const mailOptions = {
    from: process.env.usermail,
    to: email,
    subject: "You Have Change Ur Password",
    html,
  };

  mailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  sendWelcomeEmail,
  sendVerificationCode,
  sendNotice
};