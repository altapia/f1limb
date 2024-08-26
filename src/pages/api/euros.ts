import type { APIRoute } from "astro"
import { ClasificacionService } from "@/lib/clasificacionService"
import { ConfigService } from "@/lib/configService"

export const GET: APIRoute = async () => {
	const configService = new ConfigService()
	const clasificacionService = new ClasificacionService()

	const aportacion = await configService.getAportacion()
	let ganancias = await clasificacionService.getTotalGanancias()
	ganancias = Math.round(ganancias * 100) / 100
	const acumulado = Math.round((aportacion + ganancias) * 100) / 100

	const result = { aportacion, ganancias, acumulado }

	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}
