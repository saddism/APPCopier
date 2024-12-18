<template>
  <Layout>
    <slot></slot>
  </Layout>
</template>

<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"
import Layout from '@/components/Layout.vue'
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

onShow(() => {
  console.log("App Show", { currentLocale: locale.value })
})

onHide(() => {
  console.log("App Hide")
})
</script>

<style>
page {
  background-color: #f8f8f8;
}
</style>
