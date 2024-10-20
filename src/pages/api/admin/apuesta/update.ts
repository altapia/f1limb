import type { APIRoute } from "astro"
import { getSession } from "auth-astro/server"
import { generateClasificacion } from "@/lib/utils"
import { UserService } from "@/lib/userService"
import { ApuestaService } from "@/lib/apuestaService"

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
	const id = data.get("id")
	const descripcion = data.get("descripcion")
	const cuota = data.get("cuota")
	const importe = data.get("importe")
	const estado = data.get("estado")

	if (!id || !importe || !descripcion || !estado) {
		return new Response(
			JSON.stringify({
				message: "Missing required fields",
			}),
			{ status: 400 }
		)
	}

	const estadoInt = parseInt(estado.toString())
	const importeFloat = parseFloat(importe.toString())
	let cuotaFloat
	if (cuota) {
		cuotaFloat = parseFloat(cuota.toString())
	} else {
		cuotaFloat = null
	}

	if (cuotaFloat != null && estadoInt === 0) {
		return new Response(
			JSON.stringify({
				message: "La apuesta tiene cuota, el estado no puede ser Borrador",
			}),
			{ status: 400 }
		)
	}

	try {
		let apuestaService = new ApuestaService()
		await apuestaService.update(
			parseInt(id.toString()),
			descripcion.toString(),
			importeFloat,
			cuotaFloat,
			estadoInt
		)
		await generateClasificacion(parseInt(id.toString()))
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
