import { defineConfig } from "astro/config"
import vercel from "@astrojs/vercel"
import auth from "auth-astro"
import svelte from "@astrojs/svelte"
import tailwindcss from "@tailwindcss/vite"

// https://astro.build/config
export default defineConfig({
	integrations: [auth(), svelte()],
	output: "server",
	adapter: vercel(),

	vite: {
		plugins: [tailwindcss()],
	},
})
