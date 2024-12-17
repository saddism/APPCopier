/// <reference types="@dcloudio/types" />

const API_BASE_URL = 'http://localhost:3001/api';

export const sendVerificationCode = async (email: string) => {
  try {
    const response = await uni.request({
      url: `${API_BASE_URL}/auth/send-verification`,
      method: 'POST',
      data: { email }
    });

    const result = response[1];
    if (result.statusCode === 200 && result.data) {
      return result.data.success;
    }
    return false;
  } catch (error) {
    console.error('Failed to send verification code:', error);
    return false;
  }
};

export const verifyCode = async (email: string, code: string) => {
  try {
    const response = await uni.request({
      url: `${API_BASE_URL}/auth/verify-code`,
      method: 'POST',
      data: { email, code }
    });

    const result = response[1];
    if (result.statusCode === 200 && result.data) {
      return result.data.success;
    }
    return false;
  } catch (error) {
    console.error('Failed to verify code:', error);
    return false;
  }
};
