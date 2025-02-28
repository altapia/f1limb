export const prerender = false //Se renderiza en el servidor

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
	const estado = data.get("estado")

	if (!id || !estado) {
		return new Response(
			JSON.stringify({
				message: "Missing required fields",
			}),
			{ status: 400 }
		)
	}

	const estadoInt = parseInt(estado.toString())
	const apuestaService = new ApuestaService()

	try {
		await apuestaService.updateByEstado(parseInt(id.toString()), estadoInt)
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
			message: "Success! Cambiado estado a " + estado,
		}),
		{ status: 200 }
	)
}
