import { GpService } from "@/lib/gpService"
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
	const gpService = new GpService()
	const result = await gpService.getAllGpByTemp(parseInt(idTemporada))
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
	const nombre = data.get("nombre")
	const flag = data.get("flag")
	const circuit = data.get("circuit")
	const libres1 = data.get("libres1")
	const libres2 = data.get("libres2")
	const libres3 = data.get("libres3")
	const clasificacion = data.get("clasificacion")
	const clasificacionSprint = data.get("clasificacionSprint")
	const sprint = data.get("sprint")
	const carrera = data.get("carrera")

	const temporadaId = params.idTemporada

	if (!nombre || !flag || !circuit || !libres1 || !clasificacion || !carrera || !temporadaId) {
		return new Response(
			JSON.stringify({
				message: "Missing required fields",
			}),
			{ status: 400 }
		)
	}

	const gpService = new GpService()
	const result = await gpService.insert(
		nombre.toString(),
		flag.toString(),
		circuit.toString(),
		libres1.toString(),
		libres2 != null ? libres2.toString() : null,
		libres3 != null ? libres3.toString() : null,
		clasificacion.toString(),
		clasificacionSprint != null ? clasificacionSprint.toString() : null,
		sprint != null ? sprint.toString() : null,
		carrera.toString(),
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
	const gpService = new GpService()
	const result = await gpService.delete(idInt).catch((e) => {
		if (e.message.includes("FOREIGN KEY constraint failed")) {
			return {
				status: 409,
				error: "No se puede eliminar el GP porque tiene registros asociados",
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
	const nombre = data.get("nombre")
	const flag = data.get("flag")
	const circuit = data.get("circuit")
	const libres1 = data.get("libres1")
	const libres2 = data.get("libres2")
	const libres3 = data.get("libres3")
	const clasificacion = data.get("clasificacion")
	const clasificacionSprint = data.get("clasificacionSprint")
	const sprint = data.get("sprint")
	const carrera = data.get("carrera")

	if (!id || !nombre || !flag || !circuit || !libres1 || !clasificacion || !carrera) {
		return new Response(
			JSON.stringify({
				message: "Missing required fields",
			}),
			{ status: 400 }
		)
	}

	const gpService = new GpService()
	const result = await gpService.update(
		parseInt(id.toString()),
		nombre.toString(),
		flag.toString(),
		circuit.toString(),
		libres1.toString(),
		libres2 != null ? libres2.toString() : null,
		libres3 != null ? libres3.toString() : null,
		clasificacion.toString(),
		clasificacionSprint != null ? clasificacionSprint.toString() : null,
		sprint != null ? sprint.toString() : null,
		carrera.toString()
	)
	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}
