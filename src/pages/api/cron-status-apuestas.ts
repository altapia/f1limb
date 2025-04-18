export const prerender = false //Se renderiza en el servidor

import { ApuestaService } from "@/lib/apuestaService"
import { GpService } from "@/lib/gpService"
import { sendAdminTelegramMessage } from "@/lib/utils"
import type { APIRoute } from "astro"

export const GET: APIRoute = async ({ request }) => {
	const BOT_TOKEN = import.meta.env.F1LIMB_BOT_TOKEN

	if (BOT_TOKEN !== request.headers.get("authorization")) {
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

	let msg = `🤖[CRON]: Los siguientes participantes no han apostado:\n`
	result.map((p: any) => {
		msg += `${p.nombre}\n`
	})
	await sendAdminTelegramMessage(msg)
	return new Response("Comprobando cron status apuestas", {
		status: 200,
	})
}
