import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const actionsBase = repositoryName ? `/${repositoryName}/` : '/'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === 'true' ? actionsBase : '/',
  plugins: [react()],
})
