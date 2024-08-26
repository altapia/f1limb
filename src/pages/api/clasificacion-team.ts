import type { APIRoute } from "astro"
import { ClasificacionService } from "@/lib/clasificacionService"

export const GET: APIRoute = async () => {
	let clasificacionService = new ClasificacionService()
	const listClasificacion = await clasificacionService.getClasificacionEquipos()

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
