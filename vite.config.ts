import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    minify: 'terser',
    sourcemap: true,
    target: 'es2015',
    rollupOptions: {
      external: [], // Remove externalized modules that cause browser issues
      output: {
        manualChunks: {
          'vue-i18n': ['vue-i18n']
        }
      }
    },
    chunkSizeWarningLimit: 2000,
    cssCodeSplit: true
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Update to correct backend port
        changeOrigin: true,
        secure: false
      }
    }
  }
});
