export const prerender = false //Se renderiza en el servidor

import type { APIRoute } from "astro"
import { GpService } from "@/lib/gpService"
import { ApuestaService } from "@/lib/apuestaService"
import type { ApuestaVO, ParticipanteVO } from "@/lib/model"
import { ParticipanteService } from "@/lib/participanteService"

export const GET: APIRoute = async () => {
	const gpService = new GpService()
	const gp = await gpService.getCurrent()

	if (!gp || !gp.id) {
		return new Response(null, {
			status: 404,
			statusText: "No hay GPs activos",
		})
	}

	const apuestaService = new ApuestaService()
	const visible = await apuestaService.hanApostadoTodosTodo(gp.temporada?.id, gp.id, true)

	/** FIXME check usuarios */
	let listApuestas: ApuestaVO[] = []
	let participantes: ParticipanteVO[] = []

	if (visible) {
		listApuestas = await apuestaService.getApuestasByGP(gp.id)

		const participanteService = new ParticipanteService()
		participantes = await participanteService.getAll(gp.temporada?.id)

		participantes.forEach((p) => {
			p.apuestas = []
			if (listApuestas !== undefined) {
				let apuestasUsuario = listApuestas.filter((a) => a.participante?.id === p.id)
				p.apuestas = apuestasUsuario
			}
		})
	} else {
		return new Response(JSON.stringify({ message: "Las apuestas todavía no son visibles" }), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		})
	}

	return new Response(JSON.stringify(participantes), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}
