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

    <!-- Navigation footer - Only show on non-H5 platforms -->
    <!-- #ifndef H5 -->
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
    <!-- #endif -->

    <!-- Web navigation - Only show on H5 platform -->
    <!-- #ifdef H5 -->
    <view class="web-nav">
      <view class="nav-links">
        <text class="nav-link" @click="navigateTo('/pages/index/index')">{{ t('nav.home') }}</text>
        <text class="nav-link" @click="navigateTo('/pages/products/index')">{{ t('nav.products') }}</text>
        <text class="nav-link" @click="navigateTo('/pages/upload/index')">{{ t('nav.upload') }}</text>
        <text class="nav-link" @click="navigateTo('/pages/dashboard/index')">{{ t('nav.dashboard') }}</text>
      </view>
    </view>
    <!-- #endif -->
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
/* Common styles */
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Mobile styles */
/* #ifndef H5 */
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
/* #endif */

/* Web styles */
/* #ifdef H5 */
.header {
  padding: 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.main-content {
  max-width: 1200px;
  margin: 80px auto 0;
  padding: 20px;
  flex: 1;
}

.web-nav {
  background-color: #ffffff;
  padding: 15px 0;
  border-bottom: 1px solid #eaeaea;
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  z-index: 99;
}

.nav-links {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 30px;
  padding: 0 20px;
}

.nav-link {
  color: #333;
  cursor: pointer;
  font-size: 16px;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #007aff;
}

button {
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #007aff;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
}

button:hover {
  background-color: #0056b3;
}

.auth-section,
.user-section {
  display: flex;
  gap: 15px;
  align-items: center;
}
/* #endif */
</style>
