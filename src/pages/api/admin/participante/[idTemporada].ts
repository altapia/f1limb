export const prerender = false //Se renderiza en el servidor

import { ParticipanteService } from "@/lib/participanteService"
import { checkAdmin } from "@/lib/utils"
import type { APIRoute } from "astro"

export const GET: APIRoute = async ({ params, request }) => {
	const isAdmin = await checkAdmin(request)
	if (!isAdmin) {
		return new Response(
			JSON.stringify({
				message: "Usuario no autorizado",
			}),
			{ status: 401 }
		)
	}
	//se obtiene la temporada de los parámetros
	const idTemporada = params.idTemporada

	if (!idTemporada) {
		return new Response(
			JSON.stringify({
				message: "Missing required fields",
			}),
			{ status: 400 }
		)
	}
	const participanteService = new ParticipanteService()
	const result = await participanteService.getAll(parseInt(idTemporada))
	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}

export const POST: APIRoute = async ({ params, request }) => {
	const isAdmin = await checkAdmin(request)
	if (!isAdmin) {
		return new Response(
			JSON.stringify({
				message: "Usuario no autorizado",
			}),
			{ status: 401 }
		)
	}

	const data = await request.formData()
	const userId = data.get("userId")
	const teamId = data.get("teamId")
	const temporadaId = params.idTemporada

	if (!userId || !teamId || !temporadaId) {
		return new Response(
			JSON.stringify({
				message: "Missing required fields",
			}),
			{ status: 400 }
		)
	}

	const participanteService = new ParticipanteService()
	const result = await participanteService.insert(
		Number(userId),
		Number(teamId),
		Number(temporadaId)
	)
	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}

export const DELETE: APIRoute = async ({ request }) => {
	const isAdmin = await checkAdmin(request)
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
	const idInt = parseInt(id.toString())
	const participanteService = new ParticipanteService()
	const result = await participanteService.delete(idInt).catch((e) => {
		if (e.message.includes("FOREIGN KEY constraint failed")) {
			return {
				status: 409,
				error: "No se puede eliminar al participante porque tiene registros asociados",
			}
		}
		return {
			status: 500,
			error: e.message,
		}
	})
	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}

export const PUT: APIRoute = async ({ request }) => {
	const isAdmin = await checkAdmin(request)
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
	const teamId = data.get("teamId")

	if (!id || !teamId) {
		return new Response(
			JSON.stringify({
				message: "Missing required fields",
			}),
			{ status: 400 }
		)
	}

	const participanteService = new ParticipanteService()
	const result = await participanteService.updateTeam(Number(id), Number(teamId))
	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}
