import { turso } from "@/turso"

export async function generateClasificacion(id: number) {
	// A partir del id obtenemos el GP
	const { rows: rowGP } = await turso.execute({
		sql: "SELECT gpID from apuesta where id = ?",
		args: [id],
	})
	const gpId = rowGP[0].gpId

	//Se comprueba si se puede generar la clasificación, todas las apuestas en estado > 1
	const { rows: rowCheck } = await turso.execute({
		sql: "SELECT count(*) as num from apuesta where gpId = ? and (estado is null  or estado <= 1) ",
		args: [gpId],
	})

	const num = rowCheck[0].num
	const numPendientes = parseInt(num as string)
	if (numPendientes && numPendientes > 0) return

	// se genera la clasificación
	const { rows: rowClasificacion } = await turso.execute({
		sql: "select userId, sum(ganancia) as ganancia from apuesta where gpId=? group by userId order by sum(ganancia) desc; ",
		args: [gpId],
	})

	//console.log(rowClasificacion)
	let listClasificacion = rowClasificacion.map((r, index) => {
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
		}
	})

	var valueArr = listClasificacion.map(function (item) {
		return item.ganancia
	})

	valueArr.forEach((g) => {
		let result = listClasificacion.filter((c) => c.ganancia == g)

		if (result.length > 1) {
			//reparto puntos
			let total = 0
			result.forEach((res) => {
				total = total + res.puntos
			})

			result.forEach((res) => {
				res.puntos = total / result.length
			})
		}
	})

	// Delete clasificacion
	await turso.execute({
		sql: "DELETE FROM clasificacion WHERE gpId = ?",
		args: [gpId],
	})
	//Insert nueva clasificación
	listClasificacion.forEach(async (c) => {
		await turso.execute({
			sql: "INSERT INTO clasificacion (userId, gpId, ganancia, puntos)" + " values(?, ?, ?, ?)",
			args: [c.userId, c.gpId, c.ganancia, c.puntos],
		})
	})
}
