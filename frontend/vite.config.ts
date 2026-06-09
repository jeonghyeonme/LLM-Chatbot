import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import htmlConfig from 'vite-plugin-html-config'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      react(),
      htmlConfig({
        metas: [],
        scripts: []
      })
    ],
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
