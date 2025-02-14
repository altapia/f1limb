import { turso } from "@/turso"
import { GpVO } from "@/lib/model"

export class GpService {
	constructor() {}

	/**
	 * Obtiene la lista de todos los GP de la temporada actual ordeandos por fecha de carrera ASC
	 * @param idTemporada
	 * @returns
	 */
	async getAllGpByTemp(idTemporada: number) {
		const { rows: gpRows } = await turso.execute({
			sql: "SELECT * FROM gp WHERE temporada_id = ? order by carrera asc",
			args: [idTemporada],
		})

		let result: GpVO[] = []
		result = gpRows.map((r) => {
			return GpVO.toVO(r)
		})

		return result
	}

	/**
	 * Obtiene la lista de todos los GP de la temporada indicada ordeandos por fecha de carrera ASC
	 * @param idTemporada
	 * @returns
	 */
	async getAllGp(idTemporada: number) {
		const { rows: gpRows } = await turso.execute({
			sql: "SELECT * FROM gp WHERE temporada_id = ? order by carrera asc",
			args: [idTemporada],
		})

		let result: GpVO[] = []
		result = gpRows.map((r) => {
			return GpVO.toVO(r)
		})

		return result
	}

	/**
	 * Obtiene los datos del GP indicado
	 * @param id
	 * @returns
	 */
	async getGp(id: number) {
		const { rows: gpRows } = await turso.execute({
			sql: "SELECT g.id, g.nombre, g.flag, g.circuit, g.libres1, g.libres2, g.libres3, g.clasificacion, g.clasificacionSprint, g.sprint, g.carrera, t.id as temporadaId, t.nombre as temporadaNombre FROM gp g INNER JOIN temporada t on t.id = g.temporada_id WHERE g.id = ?",
			args: [id],
		})
		if (gpRows.length > 0) {
			return GpVO.toVO(gpRows[0])
		}

		return new GpVO()
	}

	/**
	 * Obtiene los datos del GP actual
	 * @param id
	 * @returns
	 */
	async getCurrent(): Promise<GpVO | null> {
		const { rows: gpRows } = await turso.execute(
			"SELECT g.id, g.nombre, g.flag, g.circuit, g.libres1, g.libres2, g.libres3, g.clasificacion, g.clasificacionSprint, g.sprint, g.carrera, t.id as temporadaId, t.nombre as temporadaNombre  " +
				"FROM gp g " +
				"INNER JOIN temporada t ON g.temporada_id = t.id and t.id = (SELECT id FROM temporada ORDER BY id DESC LIMIT 1) " +
				"WHERE DATE(g.libres1, '-1 day') <= DATE('now') " +
				"ORDER BY g.carrera desc " +
				"LIMIT 1"
		)
		if (gpRows.length > 0) {
			return GpVO.toVO(gpRows[0])
		}

		return null
	}

	/**
	 * Obtiene los datos del GP próximo
	 * @param id
	 * @returns
	 */
	async getNext() {
		const { rows: gpRows } = await turso.execute(
			"SELECT * " +
				"FROM gp WHERE DATE(libres1, '-1 day') > DATE('now') order by carrera asc limit 1;"
		)
		if (gpRows.length > 0) {
			return GpVO.toVO(gpRows[0])
		}

		return new GpVO()
	}
}
