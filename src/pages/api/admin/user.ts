import { UserService } from "@/lib/userService"
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

	const userService = new UserService()
	const result = await userService.getAll()
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
	const email = data.get("email")
	const admin = data.get("admin")
	const telegramId = data.get("telegramId")
	const telegramIdInt = Number(telegramId)
	if (!nombre || !email || !admin || !telegramId || Number.isNaN(telegramIdInt)) {
		return new Response(
			JSON.stringify({
				message: "Missing required fields",
			}),
			{ status: 400 }
		)
	}

	const userService = new UserService()
	const result = await userService.create(
		nombre.toString(),
		email.toString(),
		admin.toString() === "true",
		telegramIdInt
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

	const userService = new UserService()
	const result = await userService.delete(parseInt(id.toString()))
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
	const email = data.get("email")
	const admin = data.get("admin")
	const telegramId = data.get("telegramId")

	if (!nombre || !email || !admin || !telegramId) {
		return new Response(
			JSON.stringify({
				message: "Missing required fields",
			}),
			{ status: 400 }
		)
	}

	if (!id || !nombre) {
		return new Response(
			JSON.stringify({
				message: "Missing required fields",
			}),
			{ status: 400 }
		)
	}

	const userService = new UserService()
	const result = await userService.update(
		parseInt(id.toString()),
		nombre.toString(),
		email.toString(),
		admin.toString() === "true",
		parseInt(telegramId.toString())
	)
	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}
