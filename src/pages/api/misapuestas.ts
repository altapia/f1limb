export const prerender = false //Se renderiza en el servidor

import type { APIRoute } from "astro"
import { GpService } from "@/lib/gpService"
import { ApuestaService } from "@/lib/apuestaService"
import { ParticipanteService } from "@/lib/participanteService"

export const GET: APIRoute = async ({ request }) => {
	const BOT_TOKEN = import.meta.env.F1LIMB_BOT_TOKEN
	const idTelegram = new URL(request.url).searchParams.get("idTelegram")

	if (BOT_TOKEN !== request.headers.get("authorization") || idTelegram == null) {
		return new Response(null, {
			status: 401,
			statusText: "401 Unauthorized",
		})
	}
	const gpService = new GpService()
	const gp = await gpService.getCurrent()

	if (!gp || !gp.id) {
		return new Response(null, {
			status: 404,
			statusText: "No hay GPs activos",
		})
	}

	const participanteService = new ParticipanteService()
	const user = await participanteService.getByTelegram(parseInt(idTelegram), gp.temporada?.id ?? 0)

	if (!gp || !gp.id || !user || !user.id) {
		return new Response(null, {
			status: 404,
			statusText: "Not found",
		})
	}

	const apuestaService = new ApuestaService()
	const listApuestas = await apuestaService.getApuestasByUserAndGP(user.id, gp.id)

	return new Response(JSON.stringify(listApuestas), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}
