<template>
  <view class="register-container">
    <text class="title">{{ $t('message.auth.register.title') }}</text>

    <form @submit.prevent="handleRegister" class="register-form">
      <view class="form-group">
        <input
          v-model="email"
          type="email"
          :placeholder="$t('message.auth.register.emailPlaceholder')"
          class="form-input"
        />
      </view>

      <view class="verification-group">
        <input
          v-model="verificationCode"
          type="text"
          :placeholder="$t('message.auth.register.codePlaceholder')"
          class="form-input verification-input"
        />
        <button
          type="button"
          @click="handleSendVerification"
          :disabled="isVerifying || cooldown > 0"
          class="verification-button"
        >
          {{ cooldown > 0 ? `${cooldown}s` : $t('message.auth.register.sendCode') }}
        </button>
      </view>

      <view class="form-group">
        <input
          v-model="password"
          type="password"
          :placeholder="$t('message.auth.register.passwordPlaceholder')"
          class="form-input"
        />
      </view>

      <view class="form-group">
        <input
          v-model="confirmPassword"
          type="password"
          :placeholder="$t('message.auth.register.confirmPasswordPlaceholder')"
          class="form-input"
        />
      </view>

      <button type="submit" class="submit-button" :disabled="isRegistering">
        {{ $t('message.auth.register.submit') }}
      </button>

      <view v-if="error" class="error-message">
        {{ error }}
      </view>
    </form>

    <navigator url="/pages/auth/login" class="login-link">
      {{ $t('message.auth.register.loginLink') }}
    </navigator>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { sendVerificationCode, verifyCode } from '@/api/auth';

const { t } = useI18n();

const email = ref('');
const verificationCode = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const isRegistering = ref(false);
const isVerifying = ref(false);
const cooldown = ref(0);

const startCooldown = () => {
  cooldown.value = 60;
  const timer = setInterval(() => {
    cooldown.value--;
    if (cooldown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

const handleSendVerification = async () => {
  if (!email.value) {
    error.value = t('message.auth.register.emailRequired');
    return;
  }

  try {
    isVerifying.value = true;
    const success = await sendVerificationCode(email.value);

    if (success) {
      startCooldown();
      uni.showToast({
        title: t('message.auth.register.codeSent'),
        icon: 'success'
      });
    } else {
      error.value = t('message.auth.register.sendCodeError');
    }
  } catch (err) {
    error.value = t('message.auth.register.sendCodeError');
  } finally {
    isVerifying.value = false;
  }
};

const handleRegister = async () => {
  error.value = '';

  if (!email.value || !verificationCode.value || !password.value || !confirmPassword.value) {
    error.value = t('message.auth.register.allFieldsRequired');
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = t('message.auth.register.passwordMismatch');
    return;
  }

  try {
    isRegistering.value = true;
    const isCodeValid = await verifyCode(email.value, verificationCode.value);

    if (!isCodeValid) {
      error.value = t('message.auth.register.invalidCode');
      return;
    }

    // TODO: Add registration API call here
    uni.showToast({
      title: t('message.auth.register.success'),
      icon: 'success'
    });

    uni.navigateTo({
      url: '/pages/auth/login'
    });
  } catch (err) {
    error.value = t('message.auth.register.error');
  } finally {
    isRegistering.value = false;
  }
};
</script>

<style>
.register-container {
  padding: 40rpx;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 40rpx;
  text-align: center;
}

.register-form {
  width: 100%;
}

.form-group {
  margin-bottom: 20rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  border: 2rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.verification-group {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.verification-input {
  flex: 1;
}

.verification-button {
  width: 200rpx;
  height: 80rpx;
  background-color: #007AFF;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.verification-button:disabled {
  background-color: #ccc;
}

.submit-button {
  width: 100%;
  height: 88rpx;
  background-color: #007AFF;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 32rpx;
  margin-top: 40rpx;
}

.submit-button:disabled {
  background-color: #ccc;
}

.error-message {
  color: #ff4d4f;
  font-size: 24rpx;
  margin-top: 20rpx;
  text-align: center;
}

.login-link {
  text-align: center;
  color: #007AFF;
  font-size: 28rpx;
  margin-top: 40rpx;
}
</style>
