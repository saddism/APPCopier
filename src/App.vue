<template>
  <view class="container">
    <view class="header">
      <LanguageSwitcher class="lang-switcher" />
      <view v-if="!userStore.loading" class="auth-buttons">
        <template v-if="userStore.isAuthenticated">
          <button class="auth-btn" @click="handleLogout">{{ $t('auth.logout') }}</button>
        </template>
        <template v-else>
          <button class="auth-btn" @click="goToLogin">{{ $t('auth.login') }}</button>
          <button class="auth-btn" @click="goToRegister">{{ $t('auth.register') }}</button>
        </template>
      </view>
    </view>
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'

const { locale } = useI18n()
const userStore = useUserStore()

onLaunch(() => {
  const savedLanguage = uni.getStorageSync('language')
  if (savedLanguage) {
    locale.value = savedLanguage
  }
  userStore.init()
})

const handleLogout = async () => {
  await userStore.logout()
  uni.reLaunch({ url: '/pages/index/index' })
}

const goToLogin = () => {
  uni.navigateTo({ url: '/pages/auth/login' })
}

const goToRegister = () => {
  uni.navigateTo({ url: '/pages/auth/register' })
}

onShow(() => {
  console.log("App Show", { currentLocale: locale.value })
})

onHide(() => {
  console.log("App Hide")
})
</script>

<style>
.container {
  width: 100%;
  min-height: 100vh;
  padding: 20rpx;
}

.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.auth-buttons {
  display: flex;
  gap: 10rpx;
}

.auth-btn {
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  background-color: #4a90e2;
  color: white;
}

.lang-switcher {
  margin-right: auto;
}
</style>
