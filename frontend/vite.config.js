import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), viteSingleFile()],
  base: command === 'build' ? '/day-planner-app/' : '/',
}))
