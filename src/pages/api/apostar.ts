import type { APIRoute } from "astro"
import { turso } from "@/turso"

export const POST: APIRoute = async ({ request, redirect }) => {
	const data = await request.formData()
	const gpId = data.get("gpId")
	const userId = data.get("userId")
	const descripcion = data.get("descripcion")
	const importe = data.get("importe")
	// Validate the data - you'll probably want to do more than this
	if (!gpId || !userId || !descripcion || !importe) {
		return redirect("/gp/" + gpId + "/misapuestas?error=faltan%20datos", 302)
	}

	const { rows } = await turso.execute({
		sql: "INSERT INTO apuesta (userId, gpId, descripcion, importe, estado) values (?, ?, ?, ?, ?)",
		args: [userId.toString(), gpId.toString(), descripcion.toString(), importe.toString(), 0],
	})

	return redirect("/gp/" + gpId + "/misapuestas", 302)
}
