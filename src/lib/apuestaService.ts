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
}
