<template>
  <view class="login">
    <text class="title">{{ $t('message.auth.login') }}</text>
    <view class="form">
      <input
        type="text"
        :placeholder="$t('message.auth.email')"
        v-model="email"
        class="input"
      />
      <input
        type="password"
        :placeholder="$t('message.auth.password')"
        v-model="password"
        class="input"
      />
      <button class="submit-btn" @click="handleLogin">
        {{ $t('message.auth.submit') }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'

const { t } = useI18n()
const userStore = useUserStore()
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  // Login functionality will be implemented in step 003
  console.log('Login clicked')
}
</script>

<style>
.login {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 36rpx;
  margin-bottom: 30rpx;
}

.form {
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.input {
  padding: 20rpx;
  border: 1px solid #ddd;
  border-radius: 10rpx;
}

.submit-btn {
  margin-top: 20rpx;
  padding: 20rpx;
  background-color: #007AFF;
  color: #fff;
  border-radius: 10rpx;
}
</style>
