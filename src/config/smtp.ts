import nodemailer from 'nodemailer';

export const smtpConfig = {
  host: 'smtpdm.aliyun.com',
  port: 465, // SSL encryption
  secure: true,
  auth: {
    user: 'appcopier@guixian.cn',
    pass: 'GuiXian7758'
  }
};

export const transporter = nodemailer.createTransport(smtpConfig);

export const sendVerificationEmail = async (to: string, code: string) => {
  const mailOptions = {
    from: 'appcopier@guixian.cn',
    to,
    subject: '邮箱验证码 | Email Verification Code',
    html: `
      <div style="padding: 20px; background-color: #f5f5f5;">
        <h2>邮箱验证码 | Email Verification Code</h2>
        <p>您的验证码是：| Your verification code is: <strong>${code}</strong></p>
        <p>验证码有效期为5分钟。| The code is valid for 5 minutes.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
};

export const generateVerificationCode = () => {
  return Math.random().toString().slice(2, 8);
};

export const verifyCode = (email: string, code: string) => {
  // TODO: Implement code verification logic with storage
  // For now, always return true for testing
  return true;
};
