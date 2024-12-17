<template>
  <view class="layout">
    <!-- Header with language switcher -->
    <view class="header">
      <view class="header-content">
        <text class="title">{{ t('nav.appTitle') }}</text>
        <view class="auth-section" v-if="!userStore.isAuthenticated">
          <button @click="navigateToLogin">{{ t('auth.login') }}</button>
          <button @click="navigateToRegister">{{ t('auth.register') }}</button>
        </view>
        <view class="user-section" v-else>
          <text>{{ t('auth.welcome') }}, {{ userStore.user?.email }}</text>
          <button @click="handleLogout">{{ t('auth.logout') }}</button>
        </view>
      </view>
      <LanguageSwitcher />
    </view>

    <!-- Main content area -->
    <view class="main-content">
      <slot></slot>
    </view>

    <!-- Navigation footer -->
    <view class="footer">
      <view class="nav-item" @click="navigateTo('/pages/index/index')">
        <text>{{ t('nav.home') }}</text>
      </view>
      <view class="nav-item" @click="navigateTo('/pages/products/index')">
        <text>{{ t('nav.products') }}</text>
      </view>
      <view class="nav-item" @click="navigateTo('/pages/upload/index')">
        <text>{{ t('nav.upload') }}</text>
      </view>
      <view class="nav-item" @click="navigateTo('/pages/dashboard/index')">
        <text>{{ t('nav.dashboard') }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../stores/user'
import LanguageSwitcher from './LanguageSwitcher.vue'

const { t } = useI18n()
const userStore = useUserStore()

const navigateTo = (url: string) => {
  uni.navigateTo({ url })
}

const navigateToLogin = () => {
  uni.navigateTo({ url: '/pages/auth/login' })
}

const navigateToRegister = () => {
  uni.navigateTo({ url: '/pages/auth/register' })
}

const handleLogout = async () => {
  await userStore.logout()
  uni.showToast({
    title: t('auth.logoutSuccess'),
    icon: 'success'
  })
  uni.reLaunch({ url: '/pages/index/index' })
}
</script>

<style>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  padding: 20rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #eaeaea;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
}

.auth-section,
.user-section {
  display: flex;
  gap: 20rpx;
}

.main-content {
  flex: 1;
  padding: 20rpx;
}

.footer {
  display: flex;
  justify-content: space-around;
  padding: 20rpx;
  background-color: #ffffff;
  border-top: 1rpx solid #eaeaea;
}

.nav-item {
  padding: 10rpx;
  text-align: center;
}

button {
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  background-color: #007aff;
  color: #ffffff;
}

button:active {
  opacity: 0.8;
}
</style>
