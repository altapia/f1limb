import type { APIRoute } from "astro"
import { getSession } from "auth-astro/server"
import { UserService } from "@/lib/userService"
import { ApuestaService } from "@/lib/apuestaService"
import { ConfigService } from "@/lib/configService"

export const POST: APIRoute = async ({ request }) => {
	//check user
	let session = await getSession(request)
	const userService = new UserService()
	const isAdmin = await userService.isAdmin(session)
	if (!isAdmin) {
		return new Response(
			JSON.stringify({
				message: "Usuario no autorizado",
			}),
			{ status: 401 }
		)
	}

	const data = await request.formData()
	const gpId = data.get("gpId")
	const descripcion = data.get("descripcion")
	const cuota = data.get("cuota")
	const importe = data.get("importe")
	const estado = data.get("estado")
	const userId = data.get("userId")

	if (!gpId || !importe || !descripcion || !userId || !estado) {
		return new Response(
			JSON.stringify({
				message: "Missing required fields",
			}),
			{ status: 400 }
		)
	}

	const gpIdInt = parseInt(gpId.toString())
	const estadoInt = parseInt(estado.toString())
	const importeFloat = parseFloat(importe.toString())
	const userIdInt = parseInt(userId.toString())
	if (estadoInt > 1 && !cuota) {
		return new Response(
			JSON.stringify({
				message: "Cuota needed for this estado ",
			}),
			{ status: 400 }
		)
	}

	//validate importe disponible
	let configService = new ConfigService()
	let apuestaService = new ApuestaService()
	const maxApostable = await configService.getMaxImporteApuesta()
	const totalApostado: number = await apuestaService.getTotalApostadoGpUser(gpIdInt, userIdInt)
	const importeDisponible = maxApostable - totalApostado

	if (importeDisponible < parseFloat(importe.toString())) {
		return new Response(
			JSON.stringify({
				message: "Importe máximo disponible " + importeDisponible + "€",
			}),
			{ status: 400 }
		)
	}

	let cuotaFloat = cuota ? parseFloat(cuota.toString()) : null

	try {
		await apuestaService.insertApuestaAdmin(
			userIdInt,
			gpIdInt,
			descripcion.toString(),
			importeFloat,
			cuotaFloat,
			estadoInt
		)
	} catch (error) {
		return new Response(
			JSON.stringify({
				message: "Error! " + error,
			}),
			{ status: 500 }
		)
	}
	return new Response(
		JSON.stringify({
			message: "Success!",
		}),
		{ status: 200 }
	)
}
