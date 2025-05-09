import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
/** @type {import('vite').userConfig} */
export default defineConfig({
  plugins: [react()],

  base: '/PWA-Meteo/',
  publicDir: './public'
})
