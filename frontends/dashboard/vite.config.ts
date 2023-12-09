import { sveltekit } from '@sveltejs/kit/vite'
import { imagetools } from '@zerodevx/svelte-img/vite'
import type { UserConfig } from 'vite'

const isProd = process.env.NODE_ENV === 'production'
const config: UserConfig = {
  plugins: [sveltekit(), imagetools()],
  optimizeDeps: {
    include: ['highlight.js', 'highlight.js/lib/core'],
  },
  envPrefix: 'PUBLIC_',
  envDir: isProd ? '.' : undefined,
}

export default config
