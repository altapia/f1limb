import type { APIRoute } from "astro"
import { GpService } from "@/lib/gpService"
import { ApuestaService } from "@/lib/apuestaService"
import { TemporadaService } from "@/lib/temporadaService"

export const GET: APIRoute = async () => {
	const gpService = new GpService()
	const gp = await gpService.getCurrent()

	if (!gp || !gp.id) {
		return new Response(null, {
			status: 404,
			statusText: "Not found",
		})
	}
	const temporadaService = new TemporadaService()
	const temporada = await temporadaService.getCurrentTemporada()
	const apuestasService = new ApuestaService()
	const listParticipantes = await apuestasService.participantesHanApostadoTodo(
		temporada.id ?? 0,
		gp.id
	)
	let result: any = []
	listParticipantes.map((p) => {
		if (p.apostado === false) {
			result.push({ nombre: p.user?.nombre, apostado: p.apostado })
		}
	})

	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}
