import { turso } from "@/turso"
import type { GpVO } from "@/lib/model"

export async function generateClasificacion(id: number) {
	// A partir del id obtenemos el GP
	const { rows: rowGP } = await turso.execute({
		sql: "SELECT gpID from apuesta where id = ?",
		args: [id],
	})
	const gpId = rowGP[0].gpId

	//Se comprueba si se puede generar la clasificación, todas las apuestas en estado > 1
	const numPendientes = await getNumApuestasPendientes(gpId)
	if (numPendientes && numPendientes > 0) return

	// se genera la clasificación
	const { rows: rowClasificacion } = await turso.execute({
		sql: "select userId, round(sum(ganancia),2) as ganancia from apuesta where gpId=? group by userId order by sum(ganancia) desc; ",
		args: [gpId],
	})

	//Calcular reparto de puntos
	let listClasificacion = calcularPuntos(rowClasificacion, gpId)

	//Calcular puestos
	await calcularPuestos(listClasificacion)

	// Delete clasificacion
	await turso.execute({
		sql: "DELETE FROM clasificacion WHERE gpId = ?",
		args: [gpId],
	})

	//Insert nueva clasificación
	listClasificacion.forEach(async (c: any) => {
		await turso.execute({
			sql:
				"INSERT INTO clasificacion (userId, gpId, ganancia, puntos, puesto)" +
				" values(?, ?, ?, ?, ?)",
			args: [c.userId, c.gpId, c.ganancia, c.puntos, c.puesto],
		})
	})
}

/**
 * Obtiene el número de apuestas con estado NULL o <= 1
 * @param gpId
 * @returns Número de apuestas pendientes
 */
async function getNumApuestasPendientes(gpId: any) {
	const { rows: rowCheck } = await turso.execute({
		sql: "SELECT count(*) as num from apuesta where gpId = ? and (estado is null  or estado <= 1) ",
		args: [gpId],
	})

	const num = rowCheck[0].num
	return parseInt(num as string)
}

/**
 * Calcula los puntos otorgados a cada usuario según las ganancias obtenidas
 * En caso de empate, se suman los puntos de los puestos que ocupan y se dividen entre los participantes empatados
 * @param rowClasificacion
 * @param gpId
 * @returns Lista de clasificación con los puntos otorgados
 */
function calcularPuntos(rowClasificacion: any, gpId: any) {
	let listClasificacion = rowClasificacion.map((r: any, index: number) => {
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

		return {
			userId: r.userId,
			ganancia: r.ganancia,
			gpId: gpId,
			puntos: puntos,
			puesto: -1,
		}
	})

	let valueArr = listClasificacion.map(function (item: any) {
		return item.ganancia
	})

	valueArr.forEach((g: any) => {
		let result = listClasificacion.filter((c: any) => c.ganancia == g)

		if (result.length > 1) {
			//reparto puntos
			let total = 0
			result.forEach((res: any) => {
				total = total + res.puntos
			})

			result.forEach((res: any) => {
				res.puntos = total / result.length
			})
		}
	})
	return listClasificacion
}

/**
 * Calcula el puesto de cada participante en el GP según los puntos obtenidos.
 * @param listClasificacion Lista de clasificación con el puesto de cada usuario
 */
async function calcularPuestos(listClasificacion: any) {
	const { rows: rowsMaxApostable } = await turso.execute({
		sql: "SELECT value FROM config WHERE key=?",
		args: ["max.importe.apuestas"],
	})
	const maxApostable = rowsMaxApostable[0].value as number

	let currentPos = 0
	let totalPos = 0
	let currentPoints = -1
	listClasificacion.forEach((e: any) => {
		totalPos++
		if (e.puntos !== currentPoints) {
			currentPos = totalPos
			currentPoints = e.puntos
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
	listGp.some((gp, index) => {
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
