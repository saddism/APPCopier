<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">{{ $t('message.hello') }}</text>
    </view>
    <navigator url="/pages/upload/index" class="nav-btn">
      {{ $t('message.upload.title') }}
    </navigator>
  </view>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
  margin-bottom: 30rpx;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}

.nav-btn {
  margin-top: 30rpx;
  padding: 20rpx 40rpx;
  background-color: #007AFF;
  color: #ffffff;
  border-radius: 10rpx;
  text-decoration: none;
}
</style>
