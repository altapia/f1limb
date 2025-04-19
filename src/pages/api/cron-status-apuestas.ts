export const prerender = false //Se renderiza en el servidor

import { ApuestaService } from "@/lib/apuestaService"
import { GpService } from "@/lib/gpService"
import { sendAdminTelegramMessage, sendGroupTelegramMessage } from "@/lib/utils"
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

	if (!gp.limite_apostar) {
		return new Response(null, {
			status: 404,
			statusText: "No hay limite de apuestas",
		})
	}

	const limite = new Date(gp.limite_apostar).getTime()
	if (limite - new Date().getTime() <= 0) {
		// Ya ha pasado el limite de apuestas
		return new Response(null, {
			status: 204,
			statusText: "Ya ha pasado el limite de apuestas",
		})
	}

	if (limite - new Date().getTime() >= 1000 * 60 * 60) {
		// 1 hora
		// Si falta más de 1 hora para el cierre de apuestas, no se envía mensaje
		return new Response(null, {
			status: 204,
			statusText: "Falta más de 1 hora para el cierre de apuestas",
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
			result.push({ nombre: p.user?.nombre, telegramId: p.user?.telegramId, apostado: p.apostado })
		}
	})

	if (result.length === 0) {
		return new Response(null, {
			status: 200,
			statusText: "Todos han apostado",
		})
	}

	let msg = `GP *${gp.nombre}*\n`
	msg += `🤖 Los siguientes participantes no han apostado:\n`
	result.map((p: any) => {
		msg += `🔹[${p.nombre}](tg://user?id=${p.telegramId})\n`
	})

	const options: Intl.DateTimeFormatOptions = {
		weekday: "short",
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		timeZone: "CET",
	}

	msg += `\n⏰ *El límite para apostar es ${gp.limite_apostar.toLocaleDateString("es-ES", options)}*`
	msg += `\nQuedan ${Math.floor((limite - new Date().getTime()) / (1000 * 60))} minutos para el cierre de apuestas`

	//console.log("msg: ", msg)

	await sendGroupTelegramMessage(msg)
	return new Response("Faltan algunos por apostar. Mensaje enviado", {
		status: 200,
	})
}
