import { turso } from "@/turso"
import { GpVO } from "@/lib/model"

export class GpService {
	constructor() {}

	/**
	 * Obtiene la lista de todos los GP ordeandos por fecha de carrera ASC
	 * @returns
	 */
	async getAllGp() {
		const { rows: gpRows } = await turso.execute("SELECT * FROM gp order by carrera asc")

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
			sql: "SELECT * FROM gp WHERE id = ?",
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
	async getCurrent() {
		const { rows: gpRows } = await turso.execute(
			"SELECT * FROM gp WHERE DATE(libres1, '-1 day') <= DATE('now') order by carrera desc limit 1"
		)
		if (gpRows.length > 0) {
			return GpVO.toVO(gpRows[0])
		}

		return new GpVO()
	}

	/**
	 * Obtiene los datos del GP próximo
	 * @param id
	 * @returns
	 */
	async getNext() {
		const { rows: gpRows } = await turso.execute(
			"SELECT * FROM gp WHERE DATE(libres1, '-1 day') > DATE('now') order by carrera asc limit 1;"
		)
		if (gpRows.length > 0) {
			return GpVO.toVO(gpRows[0])
		}

		return new GpVO()
	}
}
