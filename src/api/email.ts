/// <reference types="@dcloudio/types" />

interface ApiResponse {
  statusCode: number;
  data: {
    success: boolean;
    error?: string;
  };
}

const API_BASE_URL = 'http://localhost:8000/api';

export const sendVerificationEmail = async (email: string) => {
  try {
    const [error, response] = await uni.request({
      url: `${API_BASE_URL}/auth/send-verification`,
      method: 'POST',
      data: { email }
    }) as unknown as [UniApp.GeneralCallbackResult | null, ApiResponse];

    if (!error && response.statusCode === 200) {
      return { success: true };
    }
    return { success: false, error: '发送验证码失败，请重试' };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return { success: false, error: '发送验证码失败，请重试' };
  }
};

export const verifyEmailCode = async (email: string, code: string) => {
  try {
    const [error, response] = await uni.request({
      url: `${API_BASE_URL}/auth/verify-code`,
      method: 'POST',
      data: { email, code }
    }) as unknown as [UniApp.GeneralCallbackResult | null, ApiResponse];

    if (!error && response.statusCode === 200) {
      return { success: true };
    }
    return { success: false, error: '验证码无效或已过期' };
  } catch (error) {
    console.error('Failed to verify code:', error);
    return { success: false, error: '验证失败，请重试' };
  }
};
