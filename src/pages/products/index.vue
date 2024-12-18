<template>
  <Layout>
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
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="{
            id: product.id,
            title: product.name,
            description: product.description || '',
            price: parseFloat(product.price.replace('$', '')),
            category: product.category || '',
            image: product.image
          }"
        />
      </view>

      <view v-else class="no-results">
        {{ t('products.noResults') }}
      </view>
    </view>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Layout from '@/components/Layout.vue'
import ProductCard from '@/components/ProductCard.vue'

const { t } = useI18n()

interface Product {
  id: string
  name: string
  price: string
  image: string
  description?: string
  category?: string
}

const searchQuery = ref('')
const products = ref<Product[]>([
  {
    id: '1',
    name: 'Product 1',
    price: '$99.99',
    image: '/static/images/placeholder.png',
    description: 'Product 1 description',
    category: 'Category 1'
  },
  {
    id: '2',
    name: 'Product 2',
    price: '$149.99',
    image: '/static/images/placeholder.png',
    description: 'Product 2 description',
    category: 'Category 2'
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
  padding: 20rpx;
}

.no-results {
  text-align: center;
  padding: 40rpx;
  color: #999;
}
</style>
