import type { APIRoute } from "astro"
import { GpService } from "@/lib/gpService"
import { ApuestaService } from "@/lib/apuestaService"
import type { ApuestaVO, UserVO } from "@/lib/model"
import { UserService } from "@/lib/userService"
import { ClasificacionService } from "@/lib/clasificacionService"

export const GET: APIRoute = async ({ params, request }) => {
	const gpService = new GpService()
	const gp = await gpService.getCurrent()

	if (!gp || !gp.id) {
		return new Response(null, {
			status: 404,
			statusText: "Not found",
		})
	}

	let clasificacionService = new ClasificacionService()
	const listClasificacion = await clasificacionService.getClasificacionIndividual(gp.id)

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
