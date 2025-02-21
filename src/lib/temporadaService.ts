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

	/**
	 * Obtiene la temporada por id
	 * @param id
	 * @returns
	 */
	async getById(id: number) {
		const { rows: rowsTemporada } = await turso.execute({
			sql: "SELECT * FROM temporada where id = ?",
			args: [id],
		})

		if (rowsTemporada.length > 0) {
			return TemporadaVO.toVO(rowsTemporada[0])
		}

		return null
	}

	/**
	 * Obtiene todas las temporadas
	 * @returns
	 */
	async getAll() {
		const { rows: rowsTemporada } = await turso.execute("SELECT * FROM temporada order by id")
		let result: TemporadaVO[] = []
		result = rowsTemporada.map((r) => {
			return TemporadaVO.toVO(r)
		})

		return result
	}

	/**
	 * Crea una temporada
	 * @param nombre
	 * @returns
	 */
	async create(nombre: string): Promise<number> {
		const { rowsAffected } = await turso.execute({
			sql: "INSERT INTO temporada(nombre) VALUES(?)",
			args: [nombre],
		})

		return rowsAffected
	}

	/**
	 * Elimina una temporada
	 * @param id
	 * @returns
	 */
	async delete(id: number): Promise<number> {
		const { rowsAffected } = await turso.execute({
			sql: "DELETE FROM temporada WHERE id = ?",
			args: [id],
		})

		return rowsAffected
	}

	/**
	 * Actualiza una temporada
	 * @param id
	 * @param nombre
	 * @returns
	 */
	async update(id: number, nombre: string): Promise<number> {
		const { rowsAffected } = await turso.execute({
			sql: "UPDATE temporada SET nombre = ? WHERE id = ?",
			args: [nombre, id],
		})

		return rowsAffected
	}
}
