import type { APIRoute } from "astro"
import { GpService } from "@/lib/gpService"
import { ApuestaService } from "@/lib/apuestaService"

export const GET: APIRoute = async () => {
	const gpService = new GpService()
	const gp = await gpService.getCurrent()

	if (!gp || !gp.id) {
		return new Response(null, {
			status: 404,
			statusText: "Not found",
		})
	}

	const apuestasService = new ApuestaService()
	const listUsuarios = await apuestasService.usuariosHanApostadoTodo(gp.id)
	let result: any = []
	listUsuarios.map((u) => {
		if (u.apostado === false) {
			result.push({ nombre: u.nombre, apostado: u.apostado })
		}
	})

	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}
