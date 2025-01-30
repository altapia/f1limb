import { turso } from "@/turso"
import { TemporadaVO } from "@/lib/model"

export class TemporadaService {
	constructor() {}

	/**
	 * Obtiene la temporada actual
	 * @returns
	 */
	async getCurrentTemporada() {
		const { rows: rowsTemporada } = await turso.execute(
			"SELECT * FROM temporada order by id desc limit 1"
		)

		if (rowsTemporada.length > 0) {
			return TemporadaVO.toVO(rowsTemporada[0])
		}

		return new TemporadaVO()
	}
}
