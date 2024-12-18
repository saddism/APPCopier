<template>
  <view class="layout" :class="{ 'web-layout': isH5Platform, 'mobile-layout': !isH5Platform }">
    <!-- Web/H5 Header -->
    <view v-if="isH5Platform" class="header">
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

    <!-- Web/H5 Navigation -->
    <view v-if="isH5Platform" class="web-nav">
      <view class="nav-links">
        <text class="nav-link" @click="navigateTo('/pages/index/index')">{{ t('nav.home') }}</text>
        <text class="nav-link" @click="navigateTo('/pages/products/index')">{{ t('nav.products') }}</text>
        <text class="nav-link" @click="navigateTo('/pages/upload/index')">{{ t('nav.upload') }}</text>
        <text class="nav-link" @click="navigateTo('/pages/dashboard/index')">{{ t('nav.dashboard') }}</text>
      </view>
    </view>

    <!-- Mobile Header -->
    <view v-if="!isH5Platform" class="header">
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

    <!-- Common Content Area -->
    <view class="main-content">
      <slot></slot>
    </view>

    <!-- Mobile Navigation Footer -->
    <view v-if="!isH5Platform" class="footer">
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
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import LanguageSwitcher from './LanguageSwitcher.vue'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const isH5Platform = ref(false)

onMounted(() => {
  try {
    const systemInfo = uni.getSystemInfoSync()
    const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'
    isH5Platform.value = isBrowser

    console.log('Layout Platform Detection:', {
      rawPlatform: systemInfo?.platform,
      isBrowser,
      isH5: isH5Platform.value,
      userAgent: window?.navigator?.userAgent
    })

    // Force H5 styles if in browser
    if (isBrowser && document) {
      document.documentElement.classList.add('h5-mode')
    }
  } catch (error) {
    console.error('Platform detection error:', error)
    isH5Platform.value = typeof window !== 'undefined'
  }
})

const navigateTo = (url: string) => {
  if (isH5Platform.value) {
    // Use router.push for H5 navigation
    const h5Path = url.replace('/pages', '')
    router.push(h5Path)
  } else {
    uni.navigateTo({ url })
  }
}

const navigateToLogin = () => {
  if (isH5Platform.value) {
    router.push('/auth/login')
  } else {
    uni.navigateTo({ url: '/pages/auth/login' })
  }
}

const navigateToRegister = () => {
  if (isH5Platform.value) {
    router.push('/auth/register')
  } else {
    uni.navigateTo({ url: '/pages/auth/register' })
  }
}

const handleLogout = async () => {
  await userStore.logout()
  uni.showToast({
    title: t('auth.logoutSuccess'),
    icon: 'success'
  })
  if (isH5Platform.value) {
    router.push('/')
  } else {
    uni.reLaunch({ url: '/pages/index/index' })
  }
}
</script>

<style>
/* Common styles */
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

/* Web styles */
.web-layout {
  background-color: #f8f8f8;
}

.web-layout .header {
  padding: 1rem;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.web-nav {
  margin-top: 4rem;
  padding: 1rem;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
}

.nav-links {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.nav-link {
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.nav-link:hover {
  background-color: #f0f0f0;
}

.main-content {
  flex: 1;
  padding: 2rem;
  margin-top: 6rem;
}

/* Mobile styles */
.mobile-layout {
  /* PLACEHOLDER: Mobile layout styles */
}
</style>
