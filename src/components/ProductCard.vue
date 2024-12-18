<template>
  <view class="product-card" @click="navigateToDetail">
    <image
      :src="product.image"
      mode="aspectFill"
      class="product-image"
    />
    <view class="product-info">
      <text class="product-title">{{ product.title }}</text>
      <text class="product-description">{{ product.description }}</text>
      <view class="product-meta">
        <text class="product-price">¥{{ product.price }}</text>
        <text class="product-category">{{ product.category }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface Product {
  id: string | number
  title: string
  description: string
  price: number
  category: string
  image: string
}

const props = defineProps<{
  product: Product
}>()

const navigateToDetail = () => {
  uni.navigateTo({
    url: `/pages/products/detail?id=${props.product.id}`
  })
}
</script>

<style>
.product-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  margin: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 400rpx;
}

.product-info {
  padding: 20rpx;
}

.product-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.product-description {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 36rpx;
  color: #ff6b6b;
  font-weight: bold;
}

.product-category {
  font-size: 24rpx;
  color: #999;
  background-color: #f5f5f5;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}
</style>
