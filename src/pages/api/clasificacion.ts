export const prerender = false //Se renderiza en el servidor

import type { APIRoute } from "astro"
import { ClasificacionService } from "@/lib/clasificacionService"
import { TemporadaService } from "@/lib/temporadaService"

export const GET: APIRoute = async () => {
	const temporadaService = new TemporadaService()
	const temporada = await temporadaService.getCurrentTemporada()
	let clasificacionService = new ClasificacionService()
	const listClasificacion = await clasificacionService.getClasificacionIndividual(
		temporada?.id ?? 0
	)

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
