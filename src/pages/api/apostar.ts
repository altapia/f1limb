import type { APIRoute } from "astro"
import { turso } from "@/turso"
import { getSession } from "auth-astro/server"

export const POST: APIRoute = async ({ request, redirect }) => {
	//check user
	let userId!: number
	let session = await getSession(request)
	if (session && session.user && session.user.email) {
		const { rows } = await turso.execute({
			sql: "SELECT * FROM user WHERE email = ?",
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
	const gpId = data.get("gpId")
	const descripcion = data.get("descripcion")
	const importe = data.get("importe")
	// Validate the data - you'll probably want to do more than this
	if (!gpId || !userId || !descripcion || !importe) {
		return redirect("/gp/" + gpId + "/misapuestas?error=faltan%20datos", 302)
	}

	//validate importe disponible
	const { rows: rowsApostado } = await turso.execute({
		sql: "SELECT SUM(importe) as total FROM apuesta WHERE userId = ? AND gpId = ?",
		args: [userId, gpId.toString()],
	})
	const totalApostado = rowsApostado[0].total as number

	const { rows: rowsMaxApostable } = await turso.execute({
		sql: "SELECT value FROM config WHERE key=?",
		args: ["max.importe.apuestas"],
	})
	const maxApostable = rowsMaxApostable[0].value as number
	const importeDisponible = maxApostable - totalApostado

	if (importeDisponible < parseFloat(importe.toString())) {
		return redirect("/gp/" + gpId + "/misapuestas?error=Importe disponible insuficiente", 302)
	}

	await turso.execute({
		sql: "INSERT INTO apuesta (userId, gpId, descripcion, importe, estado) values (?, ?, ?, ?, ?)",
		args: [userId, gpId.toString(), descripcion.toString(), importe.toString(), 0],
	})

	return redirect("/gp/" + gpId + "/misapuestas", 302)
}
