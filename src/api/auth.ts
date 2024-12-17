/// <reference types="@dcloudio/types" />

import { generateVerificationCode, sendVerificationEmail, verifyCode } from '@/config/email';

export const sendVerificationCode = async (email: string) => {
  try {
    const code = generateVerificationCode();
    const result = await sendVerificationEmail(email, code);
    return result;
  } catch (error) {
    console.error('Failed to send verification code:', error);
    return { success: false, error: '发送验证码失败，请重试' };
  }
};

export const verifyEmailCode = async (email: string, code: string) => {
  try {
    const isValid = verifyCode(email, code);
    return {
      success: isValid,
      error: isValid ? null : '验证码无效或已过期'
    };
  } catch (error) {
    console.error('Failed to verify code:', error);
    return { success: false, error: '验证失败，请重试' };
  }
};

// Register with email verification
export const register = async (email: string, password: string, code: string) => {
  const verifyResult = await verifyEmailCode(email, code);
  if (!verifyResult.success) {
    return verifyResult;
  }

  try {
    const response = await uni.request({
      url: `${API_BASE_URL}/auth/register`,
      method: 'POST',
      data: { email, password }
    });

    const result = response[1];
    if (result.statusCode === 200 && result.data) {
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
    const response = await uni.request({
      url: `${API_BASE_URL}/auth/login`,
      method: 'POST',
      data: { email, password }
    });

    const result = response[1];
    if (result.statusCode === 200 && result.data) {
      return { success: true, data: result.data };
    }
    return { success: false, error: '登录失败，请检查邮箱和密码' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: '登录失败，请重试' };
  }
};

const API_BASE_URL = 'http://localhost:3001/api';
