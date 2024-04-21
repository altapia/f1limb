import type { APIRoute } from "astro"
import { turso } from "@/turso"
import { getSession } from "auth-astro/server"

export const POST: APIRoute = async ({ request }) => {
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
	const { rows: rowsApostado } = await turso.execute({
		sql: "SELECT SUM(importe) as total FROM apuesta WHERE userId = ? AND gpId = ?",
		args: [userIdInt, gpId.toString()],
	})
	const totalApostado = rowsApostado[0].total as number

	const { rows: rowsMaxApostable } = await turso.execute({
		sql: "SELECT value FROM config WHERE key=?",
		args: ["max.importe.apuestas"],
	})
	const maxApostable = rowsMaxApostable[0].value as number
	const importeDisponible = maxApostable - totalApostado

	if (importeDisponible < parseFloat(importe.toString())) {
		return new Response(
			JSON.stringify({
				message: "Importe máximo disponible " + importeDisponible + "€",
			}),
			{ status: 400 }
		)
	}

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
			sql:
				"INSERT INTO apuesta (userId, gpId, descripcion, importe, cuota, estado, ganancia)" +
				" values(?, ?, ?, ?, ? ,?, round(?))",
			args: [
				userIdInt,
				gpIdInt,
				descripcion.toString(),
				importeFloat,
				cuotaFloat,
				estadoInt,
				ganancia,
			],
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
