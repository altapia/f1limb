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
	const descripcion = data.get("descripcion")
	const cuota = data.get("cuota")
	const importe = data.get("importe")
	const estado = data.get("estado")

	if (!id || !importe || !descripcion || !userId || !estado) {
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
	try {
		let ganancia
		if (estadoInt == 2) {
			ganancia = importeFloat * cuotaFloat! - importeFloat
			ganancia = Math.round(ganancia * 100) / 100
		} else if (estadoInt == 3) {
			ganancia = importeFloat * -1
			ganancia = Math.round(ganancia * 100) / 100
		} else {
			ganancia = null
		}

		await turso.execute({
			sql: "UPDATE apuesta set descripcion=?, importe=?, cuota=?, estado=?, ganancia=? WHERE id = ? ",
			args: [descripcion.toString(), importeFloat, cuotaFloat, estadoInt, ganancia, id.toString()],
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
