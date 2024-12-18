import { z } from 'zod';

// User schema for form validation
export const userSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(8, '密码至少需要8个字符'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
});

// Authentication state management
export type User = {
  id: string;
  email: string;
  emailVerified: boolean;
  trialUsed: boolean;
  isPremium: boolean;
};

export type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

// Mock authentication functions
export const auth = {
  currentUser: null as User | null,
  verificationCodes: new Map<string, string>(),
  passwords: new Map<string, string>(),

  async signUp(email: string, password: string): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if email already exists
    if (this.passwords.has(email)) {
      throw new Error('该邮箱已被注册');
    }

    // Store password for mock auth
    this.passwords.set(email, password);

    // Generate verification code
    const verificationCode = Math.random().toString(36).substr(2, 6);
    this.verificationCodes.set(email, verificationCode);

    // Mock user creation
    this.currentUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      emailVerified: false,
      trialUsed: false,
      isPremium: false
    };

    // Log verification code (in production this would be sent via email)
    console.log(`验证码: ${verificationCode} (已发送至 ${email})`);
  },

  async signIn(email: string, password: string): Promise<void> {
    // Simulate API call and password verification
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify credentials
    const storedPassword = this.passwords.get(email);
    if (!storedPassword || storedPassword !== password) {
      throw new Error('邮箱或密码错误');
    }

    // Mock user login
    this.currentUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      emailVerified: true,
      trialUsed: false,
      isPremium: false
    };
  },

  async verifyEmail(code: string): Promise<void> {
    if (!this.currentUser) throw new Error('未找到用户');

    const storedCode = this.verificationCodes.get(this.currentUser.email);
    if (!storedCode || storedCode !== code) {
      throw new Error('验证码无效');
    }

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.currentUser.emailVerified = true;
    this.verificationCodes.delete(this.currentUser.email);
  },

  async signOut(): Promise<void> {
    // Simulate sign out
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.currentUser = null;
  },

  async useTrial(): Promise<void> {
    if (!this.currentUser) throw new Error('请先登录');
    if (!this.currentUser.emailVerified) throw new Error('请先验证邮箱');
    if (this.currentUser.trialUsed) throw new Error('已使用过试用机会');

    // Simulate trial activation
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.currentUser.trialUsed = true;
  }
};
