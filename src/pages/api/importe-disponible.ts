import type { APIRoute } from "astro"
import { GpService } from "@/lib/gpService"
import { UserService } from "@/lib/userService"
import { ApuestaService } from "@/lib/apuestaService"
import { ConfigService } from "@/lib/configService"
import { TemporadaService } from "@/lib/temporadaService"

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

	const userService = new UserService()
	const user = await userService.getParticipanteByTelegram(
		parseInt(idTelegram),
		gp.temporada?.id ?? 0
	)

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

	return new Response(
		JSON.stringify({
			gp,
			importeDisponible,
		}),
		{
			status: 200,
			headers: { "Content-Type": "application/json" },
		}
	)
}
