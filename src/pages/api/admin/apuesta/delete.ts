import type { APIRoute } from "astro"
import { turso } from "@/turso"
import { getSession } from "auth-astro/server"

export const DELETE: APIRoute = async ({ request }) => {
	//check user
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
		await turso.execute({
			sql: "DELETE FROM apuesta WHERE id = ? ",
			args: [id.toString()],
		})
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
