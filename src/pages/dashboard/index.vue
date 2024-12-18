<template>
  <view class="dashboard">
    <text class="title">{{ $t('message.hello') }}</text>
    <text v-if="userStore.isAuthenticated" class="email">
      {{ userStore.email }}
    </text>
  </view>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'

const { t } = useI18n()
const userStore = useUserStore()
</script>

<style>
.dashboard {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 36rpx;
  margin-bottom: 30rpx;
}

.email {
  font-size: 28rpx;
  color: #666;
}
</style>
