export const prerender = false //Se renderiza en el servidor

import type { APIRoute } from "astro"
import { getSession } from "auth-astro/server"
import { UserService } from "@/lib/userService"
import { ApuestaService } from "@/lib/apuestaService"

export const DELETE: APIRoute = async ({ request }) => {
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

	if (!id) {
		return new Response(
			JSON.stringify({
				message: "Missing required fields",
			}),
			{ status: 400 }
		)
	}

	try {
		const apuestaService = new ApuestaService()
		await apuestaService.deleteById(parseInt(id.toString()))
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
