import { TemporadaService } from "@/lib/temporadaService"
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

	const temporadaService = new TemporadaService()
	const result = await temporadaService.getAll()
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

	const temporadaService = new TemporadaService()
	const result = await temporadaService.create(nombre.toString())
	if(result === 0){
		return new Response(
			JSON.stringify({
				message: "Se produjo un error al crear la temporada",
			}),
			{ status: 500 }
		)
	}
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
	const temporadaService = new TemporadaService()
	const result = await temporadaService.delete(idInt)
	if(result === 0){
		return new Response(
			JSON.stringify({
				message: "Se produjo un error al eliminar la temporada",
			}),
			{ status: 500 }
		)
	}
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
	const idInt = parseInt(id.toString())
	const temporadaService = new TemporadaService()
	const result = await temporadaService.update(idInt, nombre.toString())
	if(result === 0){
		return new Response(
			JSON.stringify({
				message: "Se produjo un error al actualizar la temporada",
			}),
			{ status: 500 }
		)
	}
	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}
