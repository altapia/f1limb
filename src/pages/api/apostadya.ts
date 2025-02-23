import type { APIRoute } from "astro"
import { GpService } from "@/lib/gpService"
import { ApuestaService } from "@/lib/apuestaService"

export const GET: APIRoute = async () => {
	const gpService = new GpService()
	const gp = await gpService.getCurrent()

	if (!gp || !gp.id) {
		return new Response(null, {
			status: 404,
			statusText: "No hay GPs activos",
		})
	}
	const apuestasService = new ApuestaService()
	const listParticipantes = await apuestasService.participantesHanApostadoTodo(
		gp.temporada?.id || 0,
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
