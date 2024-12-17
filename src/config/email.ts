import nodemailer from 'nodemailer';

export const emailConfig = {
  host: 'smtpdm.aliyun.com',
  port: 465, // Using SSL encryption
  secure: true,
  auth: {
    user: 'appcopier@guixian.cn',
    pass: 'GuiXian7758'
  }
};

export const transporter = nodemailer.createTransport(emailConfig);

// Generate verification code
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store verification codes with expiration
const verificationCodes: Record<string, { code: string; expires: number }> = {};

// Store verification code
export const storeVerificationCode = (email: string, code: string) => {
  verificationCodes[email] = {
    code,
    expires: Date.now() + 10 * 60 * 1000 // 10 minutes expiration
  };
};

// Verify code
export const verifyCode = (email: string, code: string): boolean => {
  const stored = verificationCodes[email];
  if (!stored) return false;
  if (Date.now() > stored.expires) {
    delete verificationCodes[email];
    return false;
  }
  if (stored.code !== code) return false;
  delete verificationCodes[email];
  return true;
};

export const sendVerificationEmail = async (to: string, verificationCode: string) => {
  const mailOptions = {
    from: 'appcopier@guixian.cn',
    to,
    subject: '邮箱验证码 - APPCopier',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2>APPCopier 邮箱验证</h2>
        <p>您好！</p>
        <p>您的验证码是：</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
          ${verificationCode}
        </div>
        <p>验证码有效期为10分钟，请尽快完成验证。</p>
        <p>如果您没有请求此验证码，请忽略此邮件。</p>
        <p>谢谢！</p>
        <p>APPCopier 团队</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    storeVerificationCode(to, verificationCode);
    return { success: true };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return { success: false, error: '发送验证码失败，请重试' };
  }
};
