<template>
  <view class="products">
    <view class="header">
      <text class="title">{{ t('products.title') }}</text>
      <input
        type="text"
        class="search"
        :placeholder="t('products.search')"
        v-model="searchQuery"
        @input="handleSearch"
      />
    </view>

    <view class="product-grid" v-if="products.length">
      <view
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card"
        @tap="navigateToDetail(product.id)"
      >
        <image
          :src="product.image"
          mode="aspectFill"
          class="product-image"
        />
        <view class="product-info">
          <text class="product-name">{{ product.name }}</text>
          <text class="product-price">{{ product.price }}</text>
        </view>
      </view>
    </view>

    <view v-else class="no-results">
      {{ t('products.noResults') }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Product {
  id: string
  name: string
  price: string
  image: string
}

const searchQuery = ref('')
const products = ref<Product[]>([
  {
    id: '1',
    name: 'Product 1',
    price: '$99.99',
    image: '/static/images/placeholder.png'
  },
  {
    id: '2',
    name: 'Product 2',
    price: '$149.99',
    image: '/static/images/placeholder.png'
  }
])

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  const query = searchQuery.value.toLowerCase()
  return products.value.filter(product =>
    product.name.toLowerCase().includes(query)
  )
})

const handleSearch = () => {
  // TODO: Implement API search
}

const navigateToDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/products/detail?id=${id}`
  })
}
</script>

<style>
.products {
  padding: 20rpx;
}

.header {
  margin-bottom: 20rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  display: block;
}

.search {
  width: 100%;
  height: 80rpx;
  border-radius: 8rpx;
  background-color: #f5f5f5;
  padding: 0 20rpx;
  font-size: 28rpx;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.product-card {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 300rpx;
}

.product-info {
  padding: 20rpx;
}

.product-name {
  font-size: 28rpx;
  margin-bottom: 10rpx;
  display: block;
}

.product-price {
  font-size: 32rpx;
  color: #ff6b6b;
  font-weight: bold;
}

.no-results {
  text-align: center;
  padding: 40rpx;
  color: #999;
}
</style>
