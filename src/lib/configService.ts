import { turso } from "@/turso"
import { ConfigVO } from "@/lib/model"

export class ConfigService {
	constructor() {}

	/**
	 * Obtiene la cantidad aporta inicialmente
	 * @returns
	 */
	async getAportacion() {
		const { rows: rowsAportacion } = await turso.execute({
			sql: "SELECT * FROM config WHERE key = ?",
			args: ["aportacion.inicial"],
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
	 * @returns
	 */
	async getMaxImporteApuesta() {
		const { rows: rowsMaxImportes } = await turso.execute({
			sql: "SELECT * FROM config WHERE key = ?",
			args: ["max.importe.apuestas"],
		})
		if (rowsMaxImportes.length > 0) {
			const row = rowsMaxImportes[0]
			const valor: string = (row.value as string) ?? ""
			return parseFloat(valor ?? 0)
		}
		return 0
	}
}
