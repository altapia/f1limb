import { turso } from "@/turso"
import { ApuestaVO } from "@/lib/model"

export class ApuestaService {
	constructor() {}

	async getApuestasByUserAndGP(userId: number, gpId: number) {
		const { rows: rowsApuestas } = await turso.execute({
			sql: "SELECT * FROM apuesta WHERE userId = ? and gpId = ? order by id asc",
			args: [userId, gpId],
		})

		let result: ApuestaVO[] = []
		result = rowsApuestas.map((r) => {
			return ApuestaVO.toVO(r)
		})

		return result
	}

	async getGpIdbyIdApuesta(id: number): Promise<number | null> {
		// A partir del id obtenemos el GP
		const { rows } = await turso.execute({
			sql: "SELECT gpID from apuesta where id = ?",
			args: [id],
		})

		const gpId = rows[0].gpId
		if (gpId !== null) {
			return parseInt(gpId.toString())
		}
		return null
	}

	async getApuestasByGP(gpId: number) {
		const { rows: rowsApuestas } = await turso.execute({
			sql: "SELECT * FROM apuesta WHERE gpId = ?",
			args: [gpId],
		})

		let result: ApuestaVO[] = []
		result = rowsApuestas.map((r) => {
			return ApuestaVO.toVO(r)
		})

		return result
	}

	async getApuestasByGPWithUser(gpId: number) {
		const { rows: rowsApuestas } = await turso.execute({
			sql: "SELECT a.id, a.descripcion, a.importe, a.cuota, a.ganancia, a.estado, a.gpId, a.userId, u.nombre as userNombre FROM apuesta a INNER JOIN user u on u.id = a.userId WHERE a.gpId = ? order by u.nombre",
			args: [gpId],
		})

		let result: ApuestaVO[] = []
		result = rowsApuestas.map((r) => {
			return ApuestaVO.toVO(r)
		})

		return result
	}

	async getApuestasById(id: number) {
		const { rows: rowsApuestas } = await turso.execute({
			sql: "SELECT a.id, a.descripcion, a.importe, a.cuota, a.estado, a.ganancia, a.gpId, a.userId, u.nombre as userNombre FROM apuesta a INNER JOIN user u on u.id = a.userId WHERE a.id = ?",
			args: [id],
		})

		return ApuestaVO.toVO(rowsApuestas[0])
	}

	async deleteByIdAndUserIdWithoutCuota(id: number, userId: number) {
		await turso.execute({
			sql: "DELETE FROM apuesta WHERE id = ? and userId = ? and cuota is null",
			args: [id, userId],
		})
	}

	async deleteById(id: number) {
		await turso.execute({
			sql: "DELETE FROM apuesta WHERE id = ? ",
			args: [id],
		})
	}

	async getTotalApostadoGpUser(gpId: number, userId: number) {
		const { rows: rowsTotalApostado } = await turso.execute({
			sql: "SELECT SUM(importe) as total FROM apuesta WHERE gpId = ? and userId = ?",
			args: [gpId, userId],
		})
		return (rowsTotalApostado[0].total as number) ?? 0
	}

	async insertApuestaUser(userId: number, gpId: number, descripcion: string, importe: number) {
		await turso.execute({
			sql: "INSERT INTO apuesta (userId, gpId, descripcion, importe, estado) values (?, ?, ?, ?, ?)",
			args: [userId, gpId, descripcion, importe, 0],
		})
	}

	async insertApuestaAdmin(
		userId: number,
		gpId: number,
		descripcion: string,
		importe: number,
		cuota: number | null,
		estado: number
	) {
		let ganancia
		if (estado == 2 && cuota !== null) {
			ganancia = importe * cuota - importe
		} else if (estado == 3) {
			ganancia = importe * -1
		} else {
			ganancia = null
		}

		await turso.execute({
			sql:
				"INSERT INTO apuesta (userId, gpId, descripcion, importe, cuota, estado, ganancia)" +
				" values(?, ?, ?, ?, ? ,?, round(?,2))",
			args: [userId, gpId, descripcion.toString(), importe, cuota, estado, ganancia],
		})
	}

	async updateByEstado(id: number, estado: number) {
		if (estado == 2) {
			await turso.execute({
				sql: "UPDATE apuesta set estado = ? , ganancia = round((importe * cuota )-importe,2) WHERE id = ? ",
				args: [estado, id],
			})
		} else if (estado == 3) {
			await turso.execute({
				sql: "UPDATE apuesta set estado = ? , ganancia = (importe * -1 ) WHERE id = ? ",
				args: [estado, id],
			})
		} else if (estado == 0 || estado == 1) {
			await turso.execute({
				sql: "UPDATE apuesta set estado = ? , ganancia = null WHERE id = ? ",
				args: [estado, id],
			})
		}
	}

	async update(
		id: number,
		descripcion: string,
		importe: number,
		cuota: number | null,
		estado: number
	) {
		let ganancia
		if (estado == 2 && cuota !== null) {
			ganancia = importe * cuota - importe
		} else if (estado == 3) {
			ganancia = importe * -1
		} else {
			ganancia = null
		}
		await turso.execute({
			sql: "UPDATE apuesta set descripcion=?, importe=?, cuota=?, estado=?, ganancia=round(?,2) WHERE id = ? ",
			args: [descripcion, importe, cuota, estado, ganancia, id],
		})
	}

	/**
	 * Obtiene el número de apuestas con estado NULL o <= 1
	 * @param gpId
	 * @returns Número de apuestas pendientes
	 */
	async getNumApuestasPendientes(gp: number) {
		const { rows: rowCheck } = await turso.execute({
			sql: "SELECT count(*) as num from apuesta where gpId = ? and (estado is null  or estado <= 1) ",
			args: [gp],
		})

		const num = rowCheck[0].num
		return parseInt(num as string)
	}
}
