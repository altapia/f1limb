import { ClasificacionVO, GpVO } from "@/lib/model"
import { ApuestaService } from "./apuestaService"
import { ConfigService } from "./configService"
import { ClasificacionService } from "./clasificacionService"
import { GpService } from "./gpService"
import { getSession } from "auth-astro/server"
import { UserService } from "./userService"

/**
 * Genera la clasificación del GP obtenido del ID de apuesta indicado, comprobando previamente si se puede
 * @param id
 * @returns
 */
export async function generateClasificacion(id: number) {
	// A partir del id obtenemos el GP
	let apuestaService = new ApuestaService()
	const gpId = await apuestaService.getGpIdbyIdApuesta(id)
	if (gpId == null) return

	//Se comprueba si se puede generar la clasificación, todas las apuestas en estado > 1
	const numPendientes = await apuestaService.getNumApuestasPendientes(gpId)

	if (numPendientes && numPendientes > 0) return
	// se genera la clasificación
	const clasificacionService = new ClasificacionService()
	let listClasificacion = await clasificacionService.getDatosClasificacion(gpId)

	//Calcular reparto de puntos
	calcularPuntos(listClasificacion)

	let gpService = new GpService()
	const gp = await gpService.getGp(gpId)

	//Calcular puestos
	await calcularPuestos(gp?.temporada?.id ?? 0, listClasificacion)

	// Delete clasificacion
	await clasificacionService.deleteClasificacionByGpId(gpId)

	//Insert nueva clasificación
	listClasificacion.forEach(async (c: ClasificacionVO) => {
		await clasificacionService.insertClasificacion(c)
	})
}

/**
 * Calcula los puntos otorgados a cada usuario según las ganancias obtenidas
 * En caso de empate, se suman los puntos de los puestos que ocupan y se dividen entre los participantes empatados
 * @param listClasificacion
 * @param gpId
 * @returns Lista de clasificación con los puntos otorgados
 */
function calcularPuntos(listClasificacion: ClasificacionVO[]): ClasificacionVO[] {
	listClasificacion.map((r: any, index: number) => {
		let puntos
		switch (index) {
			case 0:
				puntos = 14
				break
			case 1:
				puntos = 11
				break
			case 2:
				puntos = 8
				break
			case 3:
				puntos = 6
				break
			case 4:
				puntos = 4
				break
			case 5:
				puntos = 3
				break
			case 6:
				puntos = 2
				break
			case 7:
				puntos = 1
				break

			default:
				puntos = 0
				break
		}
		if (parseInt(r.ganancia as string) <= -3) {
			puntos = 0
		}
		r.puntos = puntos
		r.puesto = -1
	})

	let valueArr = listClasificacion.map(function (item: ClasificacionVO) {
		return item.ganancia
	})

	valueArr.forEach((g: any) => {
		let result = listClasificacion.filter((c: ClasificacionVO) => c.ganancia == g)

		if (result.length > 1) {
			//reparto puntos
			let total = 0
			result.forEach((res: any) => {
				total = total + res.puntos
			})

			result.forEach((res: any) => {
				res.puntos = Math.round((total / result.length) * 100) / 100
			})
		}
	})
	return listClasificacion
}

/**
 * Calcula el puesto de cada participante en el GP según los puntos obtenidos.
 * @param listClasificacion Lista de clasificación con el puesto de cada usuario
 */
async function calcularPuestos(idTemporada: number, listClasificacion: ClasificacionVO[]) {
	const configService = new ConfigService()
	const maxApostable = await configService.getMaxImporteApuesta(idTemporada)

	let currentPos = 0
	let totalPos = 0
	let currentPoints = -1
	listClasificacion.forEach((e: ClasificacionVO) => {
		totalPos++
		if (e.puntos !== currentPoints) {
			currentPos = totalPos
			currentPoints = e.puntos!
		}

		//Si ha perdido todo es DNF (puesto -1)
		if (e.ganancia == maxApostable * -1) {
			e.puesto = -1
		} else {
			e.puesto = currentPos
		}
	})
}

/**
 * Obtiene el index del GP activo de la lista, según la fecha de carrera
 * @param listGp
 * @returns index del GP activo
 */
export function getIndexGPActivo(listGp: GpVO[]) {
	let indexProximo = 0
	listGp.some((gp, index) => {
		let now = new Date()
		let fechaCarrera = new Date(gp.carrera?.getTime() || 0)
		fechaCarrera.setHours(23)
		fechaCarrera.setMinutes(59)
		fechaCarrera.setSeconds(59)

		if (now < fechaCarrera) {
			indexProximo = index
			return true
		}
	})
	return indexProximo
}

/**
 * Obtiene el id del GP activo de la lista, según la fecha de carrera
 * @param listGp
 * @returns id del GP activo
 */
export function getIdGPActivo(listGp: GpVO[]) {
	let idProximo = 0
	listGp.some((gp) => {
		let now = new Date()
		let fechaCarrera = new Date(gp.carrera?.getTime() || 0)
		fechaCarrera.setHours(23)
		fechaCarrera.setMinutes(59)
		fechaCarrera.setSeconds(59)

		if (now < fechaCarrera) {
			idProximo = gp.id || 0
			return true
		}
	})
	return idProximo
}

/**
 * Comprueba si el usuario logado es administrador
 * @param request
 * @returns
 */
export async function checkAdmin(request: any) {
	let session = await getSession(request)
	const userService = new UserService()
	return await userService.isAdmin(session)
}

/**
 * Envía un mensaje por telegram al chat del administrador
 * @param message
 * @returns
 */
export async function sendAdminTelegramMessage(message: string) {
	const TELEGRAM_ADMIN_CHAT_ID = import.meta.env.TELEGRAM_ADMIN_CHAT_ID
	sendTelegramMessage(TELEGRAM_ADMIN_CHAT_ID, message)
}

/**
 * Envía un mensaje por telegram al chat del grupo
 * @param message
 * @returns
 */
export async function sendGroupTelegramMessage(message: string) {
	const TELEGRAM_GRUPO_CHAT_ID = import.meta.env.TELEGRAM_GRUPO_CHAT_ID
	sendTelegramMessage(TELEGRAM_GRUPO_CHAT_ID, message)
}

/**
 * Envía un mensaje por telegram al chat indicado
 * @param chatId
 * @param message
 * @returns
 */
export async function sendTelegramMessage(chatId: string, message: string) {
	const BOT_TOKEN = import.meta.env.TELEGRAM_BOT_TOKEN
	try {
		const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${chatId}&parse_mode=MarkdownV2&text=${encodeURIComponent(
			message
		)}`
		// console.log("URL Telegram:", url)

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
		if (!response.ok) {
			console.error("Error al enviar el mensaje a Telegram:", response)
			throw new Error(`Error al enviar el mensaje: ${response.statusText}`)
		}
	} catch (error) {
		console.error("Error al enviar el mensaje a Telegram:", error)
	}
}

function escapeTelegramMarkdownV2(text: string) {
	return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1")
}
