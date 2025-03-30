import { defineConfig } from "astro/config"
import vercel from "@astrojs/vercel"
import auth from "auth-astro"
import svelte from "@astrojs/svelte"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
	integrations: [auth(), svelte()],
	adapter: vercel(),

	vite: {
		plugins: [tailwindcss()],
	},
})
