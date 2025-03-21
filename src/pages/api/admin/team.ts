export const prerender = false //Se renderiza en el servidor

import { TeamService } from "@/lib/teamService"
import { checkAdmin } from "@/lib/utils"
import type { APIRoute } from "astro"

export const GET: APIRoute = async ({ request }) => {
	const isAdmin = await checkAdmin(request)
	if (!isAdmin) {
		return new Response(
			JSON.stringify({
				message: "Usuario no autorizado",
			}),
			{ status: 401 }
		)
	}

	const teamService = new TeamService()
	const result = await teamService.getAll()
	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}

export const POST: APIRoute = async ({ request }) => {
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
	const nombre = data.get("nombre")

	if (!nombre) {
		return new Response(
			JSON.stringify({
				message: "Missing required fields",
			}),
			{ status: 400 }
		)
	}

	const teamService = new TeamService()
	const result = await teamService.insert(nombre.toString())
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
	const nombre = data.get("nombre")

	if (!id || !nombre) {
		return new Response(
			JSON.stringify({
				message: "Missing required fields",
			}),
			{ status: 400 }
		)
	}

	const teamService = new TeamService()
	const result = await teamService.update(parseInt(id.toString()), nombre.toString())
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

	const teamService = new TeamService()
	const result = await teamService.delete(parseInt(id.toString()))
	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}
