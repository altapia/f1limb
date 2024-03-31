import type { APIRoute } from "astro"
import { turso } from "@/turso"
import { getSession } from "auth-astro/server"

export const POST: APIRoute = async ({ request, redirect }) => {
	//check user
	let userId!: number
	let session = await getSession(request)
	if (session && session.user && session.user.email) {
		const { rows } = await turso.execute({
			sql: "SELECT * FROM user WHERE email = ? and admin = 1",
			args: [session.user.email],
		})
		if (rows.length == 0) {
			return new Response(
				JSON.stringify({
					message: "Usuario no autorizado",
				}),
				{ status: 401 }
			)
		}
		userId = rows[0].id as number
	}

	const data = await request.formData()
	const id = data.get("id")
	const gpId = data.get("gpId")
	const estado = data.get("estado")

	if (!id || !userId || !estado) {
		return new Response(
			JSON.stringify({
				message: "Missing required fields",
			}),
			{ status: 400 }
		)
	}

	const estadoInt = parseInt(estado.toString())

	if (estadoInt == 2) {
		await turso.execute({
			sql: "UPDATE apuesta set estado = ? , ganancia = (importe * cuota )-importe WHERE id = ? ",
			args: [estadoInt, id.toString()],
		})
	} else if (estadoInt == 3) {
		await turso.execute({
			sql: "UPDATE apuesta set estado = ? , ganancia = (importe * -1 ) WHERE id = ? ",
			args: [estadoInt, id.toString()],
		})
	}

	return redirect("/gp/" + gpId + "/admin", 302)
}
