import type { APIRoute } from "astro"
import { turso } from "@/turso"

export const POST: APIRoute = async ({ request, redirect }) => {
	const data = await request.formData()
	const id = data.get("id")
	const gpId = data.get("gpId")
	const userId = data.get("userId")
	// Validate the data - you'll probably want to do more than this
	if (!id || !userId) {
		return new Response(
			JSON.stringify({
				message: "Missing required fields",
			}),
			{ status: 400 }
		)
	}

	const { rows } = await turso.execute({
		sql: "DELETE FROM apuesta WHERE id = ? and userId = ? and cuota is null",
		args: [id.toString(), userId.toString()],
	})

	return redirect("/gp/" + gpId + "/misapuestas", 302)
}
