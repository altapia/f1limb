import type { APIRoute } from "astro"
import { GpService } from "@/lib/gpService"

export const GET: APIRoute = async () => {
	const gpService = new GpService()
	const gp = await gpService.getCurrent()
	if (!gp) {
		return new Response(null, {
			status: 404,
			statusText: "Not found",
		})
	}

	return new Response(JSON.stringify(gp), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}