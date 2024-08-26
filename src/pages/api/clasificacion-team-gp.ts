import type { APIRoute } from "astro"
import { GpService } from "@/lib/gpService"
import { ClasificacionService } from "@/lib/clasificacionService"

export const GET: APIRoute = async () => {
	const gpService = new GpService()
	const gp = await gpService.getCurrent()

	if (!gp || !gp.id) {
		return new Response(null, {
			status: 404,
			statusText: "Not found",
		})
	}

	let clasificacionService = new ClasificacionService()
	const listClasificacion = await clasificacionService.getClasificacionEquipos(gp.id)

	if (listClasificacion.length === 0) {
		return new Response(JSON.stringify({ message: " La clasificación todavía no es visible" }), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		})
	}

	return new Response(JSON.stringify(listClasificacion), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}
