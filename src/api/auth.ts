/// <reference types="@dcloudio/types" />
import { sendVerificationEmail, verifyEmailCode } from './email';

interface ApiResponse {
  statusCode: number;
  data: {
    success: boolean;
    error?: string;
    token?: string;
  };
}

export const sendVerificationCode = async (email: string) => {
  return await sendVerificationEmail(email);
};

export const verifyCode = async (email: string, code: string) => {
  return await verifyEmailCode(email, code);
};

// Register with email verification
export const register = async (email: string, password: string, code: string) => {
  const verifyResult = await verifyCode(email, code);
  if (!verifyResult.success) {
    return verifyResult;
  }

  try {
    const [error, response] = await uni.request({
      url: `${API_BASE_URL}/auth/register`,
      method: 'POST',
      data: { email, password }
    }) as unknown as [UniApp.GeneralCallbackResult | null, ApiResponse];

    if (!error && response.statusCode === 200 && response.data) {
      return { success: true };
    }
    return { success: false, error: '注册失败，请重试' };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: '注册失败，请重试' };
  }
};

// Login
export const login = async (email: string, password: string) => {
  try {
    const [error, response] = await uni.request({
      url: `${API_BASE_URL}/auth/login`,
      method: 'POST',
      data: { email, password }
    }) as unknown as [UniApp.GeneralCallbackResult | null, ApiResponse];

    if (!error && response.statusCode === 200 && response.data) {
      return { success: true, data: response.data };
    }
    return { success: false, error: '登录失败，请检查邮箱和密码' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: '登录失败，请重试' };
  }
};

const API_BASE_URL = 'http://localhost:8000/api';
