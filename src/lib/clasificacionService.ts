import { turso } from "@/turso"
import { ClasificacionVO, TablaClasificacionVO } from "@/lib/model"

export class ClasificacionService {
	constructor() {}

	async getTotalGanancias(): Promise<number> {
		const { rows: rowsGanancias } = await turso.execute(
			"SELECT SUM(ganancia) as total FROM clasificacion"
		)
		let ganancias = 0
		if (rowsGanancias.length > 0) {
			ganancias = rowsGanancias[0].total as number
		}
		return ganancias
	}

	async getClasificacionIndividual(gpId: number | undefined): Promise<ClasificacionVO[]> {
		let result: ClasificacionVO[] = []

		if (gpId) {
			const { rows } = await turso.execute({
				sql:
					"SELECT c.id, c.userId, c.gpId, c.ganancia, c.puntos, u.nombre as userNombre, t.nombre as teamNombre, t.id as teamId " +
					"FROM clasificacion c " +
					"LEFT JOIN user u ON u.id = c.userId " +
					"LEFT JOIN team t ON t.id = u.teamId " +
					"WHERE c.gpId = ? ORDER BY c.puntos desc, ganancia desc",
				args: [gpId],
			})

			result = rows.map((r) => {
				return ClasificacionVO.toVO(r)
			})
		} else {
			const { rows } = await turso.execute(
				"SELECT c.id, c.userId, SUM(c.ganancia) as ganancia, SUM(c.puntos) as puntos, u.nombre as userNombre, t.nombre as teamNombre, t.id as teamId " +
					"FROM clasificacion c " +
					"LEFT JOIN user u ON u.id = c.userId " +
					"LEFT JOIN team t ON t.id = u.teamId " +
					"GROUP BY c.userId " +
					"ORDER BY SUM(c.puntos) desc,  SUM(c.ganancia) desc"
			)
			result = rows.map((r) => {
				return ClasificacionVO.toVO(r)
			})
		}
		return result
	}

	async getClasificacionEquipos(gpId: number | undefined): Promise<ClasificacionVO[]> {
		let result: ClasificacionVO[] = []
		if (gpId) {
			const { rows } = await turso.execute({
				sql:
					"SELECT c.id,  SUM(c.ganancia) as ganancia, SUM(c.puntos) as puntos,  t.nombre as teamNombre, t.id as teamId " +
					"FROM clasificacion c " +
					"LEFT JOIN user u ON u.id = c.userId " +
					"LEFT JOIN team t ON t.id = u.teamId " +
					"WHERE c.gpId = ? GROUP BY t.id ORDER BY SUM(c.puntos) desc,  SUM(c.ganancia) desc",
				args: [gpId],
			})

			result = rows.map((r) => {
				return ClasificacionVO.toVO(r)
			})
		} else {
			const { rows } = await turso.execute(
				"SELECT c.id,  SUM(c.ganancia) as ganancia, SUM(c.puntos) as puntos,  t.nombre as teamNombre, t.id as teamId " +
					"FROM clasificacion c " +
					"LEFT JOIN user u ON u.id = c.userId " +
					"LEFT JOIN team t ON t.id = u.teamId " +
					"GROUP BY t.id ORDER BY SUM(c.puntos) desc, SUM(c.ganancia) desc"
			)
			result = rows.map((r) => {
				return ClasificacionVO.toVO(r)
			})
		}
		return result
	}

	async getTablaClasificacion(): Promise<TablaClasificacionVO[]> {
		const { rows } = await turso.execute(
			"SELECT * FROM v_tabla_clasificacion order by total desc, ganancia desc"
		)

		let result: TablaClasificacionVO[] = []
		result = rows.map((r) => {
			return TablaClasificacionVO.toVO(r)
		})
		return result
	}

	async deleteClasificacionByGpId(gpId: number) {
		await turso.execute({
			sql: "DELETE FROM clasificacion WHERE gpId = ?",
			args: [gpId],
		})
	}

	async insertClasificacion(c: ClasificacionVO) {
		await turso.execute({
			sql:
				"INSERT INTO clasificacion (userId, gpId, ganancia, puntos, puesto)" +
				" values(?, ?, ?, ?, ?)",
			args: [c.user?.id!, c.gp?.id!, c.ganancia!, c.puntos!, c.puesto!],
		})
	}

	async getDatosClasificacion(gpId: number): Promise<ClasificacionVO[]> {
		// se genera la clasificación
		const { rows } = await turso.execute({
			sql: "select userId, round(sum(ganancia),2) as ganancia, gpId from apuesta where gpId=? group by userId order by sum(ganancia) desc",
			args: [gpId],
		})

		let result: ClasificacionVO[] = []
		result = rows.map((r) => {
			return ClasificacionVO.toVO(r)
		})
		return result
	}
}
