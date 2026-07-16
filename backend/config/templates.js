import sendMail from "./nodeMailer.js"

export const forgotPasswordTemplate = (resetUrl, user) => {

    const html = `

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    /* Inline-friendly CSS for email clients */
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f3f4f6;
      color: #374151;
    }
    .wrapper {
      width: 100%;
      background-color: #f3f4f6;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #fffbeb;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 40px 20px 20px;
    }
    .logo {
      font-size: 36px;
      font-weight: bold;
      margin: 0;
    }
    .text-blue {
      color: #3b82f6;
    }
    .text-slate {
      color: #1e293b;
      font-weight: 300;
    }
    .content {
      padding: 20px 40px;
      font-size: 16px;
      line-height: 1.6;
      color: #4b5563;
    }
    .content h2 {
      color: #1f2937;
      font-size: 20px;
      margin-top: 0;
    }
    .btn-container {
      text-align: center;
      margin: 35px 0;
    }
    .btn {
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
      display: inline-block;
    }
    .footer {
      padding: 20px 40px 30px;
      font-size: 13px;
      color: #6b7280;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="container" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td class="header">
          <h1 class="logo">
            <span class="text-blue">Task</span><span class="text-slate">Flow</span>
          </h1>
        </td>
      </tr>
      <tr>
        <td class="content">
          <h2>Password Reset Request</h2>
          <p>Hello,&nbsp; ${user.name}</p>
          <p>We received a request to reset the password for your TaskFlow account. If you didn't make this request, you can safely ignore this email.</p>
          <p>To set up a new password, click the button below. This link will expire in <strong>15 minutes</strong>.</p>
          
          <div class="btn-container">
            <a href="${resetUrl}" class="btn">Reset Password</a>
          </div>
          
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p>&copy; ${new Date().getFullYear()}. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>

`

    return sendMail.sendMail({
        from: `"TaskFlow Support" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Password Reset Request",
        html
    })

}