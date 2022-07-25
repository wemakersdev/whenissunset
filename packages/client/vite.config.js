import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tsconfigPaths from 'vite-tsconfig-paths'
import windiCSS from 'vite-plugin-windicss'
import { VitePWA } from 'vite-plugin-pwa'
import manifestJSON from './src/manifest.json'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		tsconfigPaths({
			root: "./"
		}),
		svelte(),
		windiCSS(),
		VitePWA({
			manifest: manifestJSON,
			strategies: "injectManifest",
			srcDir: "src/ServiceWorker",
			filename: "ServiceWorker.ts",
			devOptions: {
				enabled: true,
				type: "module"
			},		
		})
	],
})

