<template>
  <Layout>
    <view class="product-detail">
      <view class="header">
        <text class="title">{{ t('products.detail') }}</text>
      </view>

      <view class="content" v-if="product">
        <image
          :src="product.image"
          mode="aspectFill"
          class="product-image"
        />

        <view class="info">
          <text class="name">{{ product.name }}</text>
          <text class="price">{{ product.price }}</text>
          <text class="category">{{ t('products.category') }}: {{ product.category }}</text>
          <text class="description">{{ t('products.description') }}: {{ product.description }}</text>
        </view>

        <button
          class="add-to-cart"
          @tap="handleAddToCart"
        >
          {{ t('products.addToCart') }}
        </button>
      </view>

      <view v-else class="loading">
        {{ t('common.loading') }}
      </view>
    </view>
  </Layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { onLoad } from '@dcloudio/uni-app'
import Layout from '@/components/Layout.vue'

const { t } = useI18n()

interface Product {
  id: string
  name: string
  price: string
  category: string
  description: string
  image: string
}

const product = ref<Product | null>(null)

onLoad((options) => {
  // Get product ID from route params
  const id = options.id
  // TODO: Fetch product data from API
  product.value = {
    id,
    name: 'Product Name',
    price: '$99.99',
    category: 'Category',
    description: 'Product description goes here',
    image: '/static/images/placeholder.png'
  }
})

const handleAddToCart = () => {
  uni.showToast({
    title: t('products.addToCart'),
    icon: 'success'
  })
}
</script>

<style>
.product-detail {
  padding: 20rpx;
}

.header {
  padding: 20rpx 0;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
}

.product-image {
  width: 100%;
  height: 500rpx;
  border-radius: 16rpx;
}

.info {
  padding: 20rpx 0;
}

.name {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.price {
  font-size: 36rpx;
  color: #ff6b6b;
  margin-bottom: 10rpx;
}

.category, .description {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.add-to-cart {
  margin-top: 30rpx;
  background-color: #007aff;
  color: #fff;
  border-radius: 8rpx;
  padding: 20rpx;
  text-align: center;
}

.loading {
  text-align: center;
  padding: 40rpx;
  color: #999;
}
</style>
