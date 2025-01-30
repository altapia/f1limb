import { turso } from "@/turso"
import { ClasificacionVO, TablaClasificacionVO } from "@/lib/model"

export class ClasificacionService {
	constructor() {}

	/**
	 * Obtiene las ganancias por GP o totales total de ganancias
	 * @param idTemporada
	 * @param gpId
	 * @returns
	 */
	async getTotalGanancias(idTemporada: number, gpId?: number): Promise<number> {
		let ganancias = 0

		if (gpId) {
			const { rows: rowsGanancias } = await turso.execute({
				sql:
					"SELECT SUM(c.ganancia) as total " +
					"FROM clasificacion c " +
					"INNER JOIN gp g ON g.id = c.gpId " +
					"WHERE c.gpId = ? and g.temporada_id = ?",
				args: [gpId, idTemporada],
			})
			if (rowsGanancias.length > 0) {
				ganancias = rowsGanancias[0].total as number
			}
		} else {
			const { rows: rowsGanancias } = await turso.execute({
				sql:
					"SELECT SUM(c.ganancia) as total " +
					"FROM clasificacion c " +
					"INNER JOIN gp g ON g.id = c.gpId " +
					"WHERE g.temporada_id = ?",
				args: [idTemporada],
			})
			if (rowsGanancias.length > 0) {
				ganancias = rowsGanancias[0].total as number
			}
		}
		return ganancias
	}

	/**
	 * Obtiene la clasificación individual del gp indicado o la global si no se indica gp
	 * @param idTemporada
	 * @param gpId
	 * @returns
	 */
	async getClasificacionIndividual(idTemporada: number, gpId?: number): Promise<ClasificacionVO[]> {
		let result: ClasificacionVO[] = []

		if (gpId) {
			const { rows } = await turso.execute({
				sql:
					"SELECT c.id, c.participante_id, c.gpId, c.ganancia, c.puntos, c.puesto, u.id as userId, u.nombre as userNombre, t.nombre as teamNombre, t.id as teamId  " +
					"FROM clasificacion c " +
					"INNER JOIN gp g ON g.id = c.gpId " +
					"LEFT JOIN participante p ON p.id = c.participante_id " +
					"LEFT JOIN user u ON u.id = p.user_id " +
					"LEFT JOIN team t ON t.id = p.team_id " +
					"WHERE c.gpId = ? ORDER BY c.puntos desc, ganancia desc",
				args: [gpId],
			})

			result = rows.map((r) => {
				return ClasificacionVO.toVO(r)
			})
		} else {
			const { rows } = await turso.execute({
				sql:
					"SELECT c.id, u.id as userId, SUM(c.ganancia) as ganancia, SUM(c.puntos) as puntos, u.id as userId, u.nombre as userNombre, t.nombre as teamNombre, t.id as teamId " +
					"FROM clasificacion c " +
					"INNER JOIN gp g ON g.id = c.gpId " +
					"LEFT JOIN participante p ON p.id = c.participante_id " +
					"LEFT JOIN user u ON u.id = p.user_id " +
					"LEFT JOIN team t ON t.id = p.team_id " +
					"WHERE g.temporada_id = ? " +
					"GROUP BY userId " +
					"ORDER BY SUM(c.puntos) desc,  SUM(c.ganancia) desc",
				args: [idTemporada],
			})
			result = rows.map((r) => {
				return ClasificacionVO.toVO(r)
			})
		}
		return result
	}

	/**
	 * Obtiene la clasificación por equipos de un GP o la global si no se indica GP
	 * @param idTemporada
	 * @param gpId
	 * @returns
	 */
	async getClasificacionEquipos(idTemporada: number, gpId?: number): Promise<ClasificacionVO[]> {
		let result: ClasificacionVO[] = []
		if (gpId) {
			const { rows } = await turso.execute({
				sql:
					"SELECT c.id,  SUM(c.ganancia) as ganancia, SUM(c.puntos) as puntos,  t.nombre as teamNombre, t.id as teamId " +
					"FROM clasificacion c " +
					"INNER JOIN gp g ON g.id = c.gpId " +
					"LEFT JOIN participante p ON p.id = c.participante_id " +
					"LEFT JOIN team t ON t.id = p.team_id " +
					"WHERE c.gpId = ? GROUP BY t.id ORDER BY SUM(c.puntos) desc,  SUM(c.ganancia) desc",
				args: [gpId],
			})

			result = rows.map((r) => {
				return ClasificacionVO.toVO(r)
			})
		} else {
			const { rows } = await turso.execute({
				sql:
					"SELECT c.id, SUM(c.ganancia) as ganancia, SUM(c.puntos) as puntos, t.nombre as teamNombre, t.id as teamId " +
					"FROM clasificacion c " +
					"INNER JOIN gp g ON g.id = c.gpId " +
					"LEFT JOIN participante p ON p.id = c.participante_id " +
					"LEFT JOIN team t ON t.id = p.team_id " +
					"WHERE g.temporada_id = ? " +
					"GROUP BY t.id ORDER BY SUM(c.puntos) desc, SUM(c.ganancia) desc",
				args: [idTemporada],
			})
			result = rows.map((r) => {
				return ClasificacionVO.toVO(r)
			})
		}
		return result
	}

	/**
	 * Obtiene la tabla de clasificación
	 * @param idTemporada
	 * @returns
	 */
	async getTablaClasificacion(idTemporada: number): Promise<TablaClasificacionVO[]> {
		const { rows } = await turso.execute({
			sql: "SELECT * FROM v_tabla_clasificacion where temporada_id = ? order by total desc, ganancia desc",
			args: [idTemporada],
		})

		let result: TablaClasificacionVO[] = []
		result = rows.map((r) => {
			return TablaClasificacionVO.toVO(r)
		})
		return result
	}

	/**
	 * Elimina la clasificación del gp indicado
	 * @param gpId
	 */
	async deleteClasificacionByGpId(gpId: number) {
		await turso.execute({
			sql: "DELETE FROM clasificacion WHERE gpId = ?",
			args: [gpId],
		})
	}

	/**
	 * Inserta un registo de clasificación
	 * @param c
	 */
	async insertClasificacion(c: ClasificacionVO) {
		await turso.execute({
			sql:
				"INSERT INTO clasificacion (participante_id, gpId, ganancia, puntos, puesto)" +
				" values(?, ?, ?, ?, ?)",
			args: [c.participante?.id!, c.gp?.id!, c.ganancia!, c.puntos!, c.puesto!],
		})
	}

	/**
	 * Obtiene los datos para la clasificación de un GP
	 * @param gpId
	 * @returns
	 */
	async getDatosClasificacion(gpId: number): Promise<ClasificacionVO[]> {
		const { rows } = await turso.execute({
			sql: "select participante_id, round(sum(ganancia),2) as ganancia, gpId from apuesta where gpId=? group by participante_id order by sum(ganancia) desc",
			args: [gpId],
		})

		let result: ClasificacionVO[] = []
		result = rows.map((r) => {
			return ClasificacionVO.toVO(r)
		})
		return result
	}
}
