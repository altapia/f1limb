import { turso } from "@/turso"
import { ConfigVO } from "@/lib/model"

export class ConfigService {
	constructor() {}

	/**
	 * Obtiene la cantidad aporta inicialmente
	 * @param idTemporada
	 * @returns
	 */
	async getAportacion(idTemporada: number) {
		const { rows: rowsAportacion } = await turso.execute({
			sql: "SELECT * FROM config WHERE key = ? and temporada_id = ?",
			args: ["aportacion.inicial", idTemporada],
		})

		let aportacion = 0
		if (rowsAportacion.length > 0) {
			const config = ConfigVO.toVO(rowsAportacion[0])
			aportacion = parseInt(config.value || "0")
		}
		return aportacion
	}

	/**
	 * Obtiene la cantidad máxima de apuesta por GP
	 * @param idTemporada
	 * @returns
	 */
	async getMaxImporteApuesta(idTemporada: number) {
		const { rows: rowsMaxImportes } = await turso.execute({
			sql: "SELECT * FROM config WHERE key = ? and temporada_id = ?",
			args: ["max.importe.apuestas", idTemporada],
		})
		if (rowsMaxImportes.length > 0) {
			const row = rowsMaxImportes[0]
			const valor: string = (row.value as string) ?? ""
			return parseFloat(valor ?? 0)
		}
		return 0
	}

	/**
	 * Obtiene todas las configuraciones de una temporada
	 * @param idTemporada
	 */
	async getAll(idTemporada: number) {
		const { rows } = await turso.execute({
			sql: "SELECT * FROM config WHERE temporada_id = ? order by key",
			args: [idTemporada],
		})

		let result: ConfigVO[] = []
		result = rows.map((r) => {
			return ConfigVO.toVO(r)
		})

		return result
	}

	/**
	 * Actualiza una configuración
	 * @param idTemporada
	 * @param key
	 * @param value
	 * @returns
	 */
	async update(idTemporada: number, key: string, value: string): Promise<number> {
		const { rowsAffected } = await turso.execute({
			sql: "UPDATE config SET value = ? WHERE temporada_id = ? and key = ?",
			args: [value, idTemporada, key],
		})

		return rowsAffected
	}
}
