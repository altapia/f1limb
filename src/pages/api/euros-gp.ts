export const prerender = false //Se renderiza en el servidor

import type { APIRoute } from "astro"
import { ClasificacionService } from "@/lib/clasificacionService"
import { GpService } from "@/lib/gpService"

export const GET: APIRoute = async () => {
	const clasificacionService = new ClasificacionService()
	const gpService = new GpService()
	const gp = await gpService.getCurrent()

	if (!gp || !gp.id) {
		return new Response(null, {
			status: 404,
			statusText: "No hay GPs activos",
		})
	}

	let ganancias = await clasificacionService.getTotalGanancias(gp.id)
	ganancias = Math.round(ganancias * 100) / 100

	const result = { ganancias }

	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}
