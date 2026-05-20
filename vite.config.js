import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),    tailwindcss()],
  base:'/youtube-clone',
  server: {
    proxy: {
      '/youtube-search': {
        target: 'https://suggestqueries.google.com',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace('/youtube-search', ''),
      },
    },
  },
})
