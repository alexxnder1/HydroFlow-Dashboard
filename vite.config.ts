import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  build: {
    outDir: "../HydroFlow-ESP32/data",
    emptyOutDir: true
  },
  optimizeDeps: {
    include: ['lodash-es']
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
