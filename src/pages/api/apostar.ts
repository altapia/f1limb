export const prerender = false //Se renderiza en el servidor

import type { APIRoute } from "astro"
import { GpService } from "@/lib/gpService"
import { ApuestaService } from "@/lib/apuestaService"
import { ConfigService } from "@/lib/configService"
import { TemporadaService } from "@/lib/temporadaService"
import { ParticipanteService } from "@/lib/participanteService"
import { sendAdminTelegramMessage } from "@/lib/utils"

export const POST: APIRoute = async ({ request }) => {
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

	if (!user || !user.id) {
		return new Response(null, {
			status: 404,
			statusText: "Usuario no encontrado",
		})
	}

	const apuestaService = new ApuestaService()
	let configService = new ConfigService()

	const temporadaService = new TemporadaService()
	const temporada = await temporadaService.getCurrentTemporada()

	const maxImporte = await configService.getMaxImporteApuesta(temporada.id ?? 0)
	const totalApostado: number = await apuestaService.getTotalApostadoGpUser(gp.id, user.id)
	const importeDisponible = Math.round((maxImporte - totalApostado) * 100) / 100

	const body = await request.json()
	const { descripcion, importe } = body
	if (importeDisponible < importe) {
		return new Response(
			JSON.stringify({
				error: "1",
				message: `No tienes importe disponible para apostar.\nDisponible: ${importeDisponible}€, apostado: ${importe}€`,
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			}
		)
	}

	try {
		await apuestaService.insertApuestaUser(user.id, gp.id, descripcion.toString(), importe)

		if (importeDisponible - importe == 0) {
			await sendAdminTelegramMessage(
				`ℹ️El usuario ${user.user?.nombre} ha apostdo todo para el GP de ${gp.nombre}.`
			)
		}
	} catch (error) {
		return new Response(
			JSON.stringify({
				error: "0",
				message: "Error! " + error,
			}),
			{ status: 500 }
		)
	}

	return new Response("OK", {
		status: 200,
		headers: { "Content-Type": "application/json" },
	})
}
