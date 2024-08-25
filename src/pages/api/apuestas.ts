import type { APIRoute } from "astro"
import { GpService } from "@/lib/gpService"
import { ApuestaService } from "@/lib/apuestaService"
import type { ApuestaVO, UserVO } from "@/lib/model"
import { UserService } from "@/lib/userService"

export const GET: APIRoute = async ({ params, request }) => {
	const gpService = new GpService()
	const gp = await gpService.getCurrent()

	if (!gp || !gp.id) {
		return new Response(null, {
			status: 404,
			statusText: "Not found",
		})
	}

	const apuestaService = new ApuestaService()
	const visible = await apuestaService.hanApostadoTodosTodo(gp.id, true)

	let listApuestas: ApuestaVO[] = []
	let usuarios: UserVO[] = []

	if (visible) {
		listApuestas = await apuestaService.getApuestasByGP(gp.id)

		let userService = new UserService()
		usuarios = await userService.getUsersTeam()

		usuarios.forEach((u) => {
			u.apuestas = []
			if (listApuestas !== undefined) {
				let apuestasUsuario = listApuestas.filter((a) => a.user?.id === u.id)
				u.apuestas = apuestasUsuario
			}
		})
	} else {
		return new Response(JSON.stringify({ message: "Las apuestas todavía no son visibles" }), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		})
	}

	return new Response(JSON.stringify(usuarios), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}
