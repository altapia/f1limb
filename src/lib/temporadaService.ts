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
		const transaction = await turso.transaction("write");
		try {
			const rs = await transaction.execute({
				sql: "INSERT INTO temporada(nombre) VALUES(?)",
				args: [nombre],
			})
			
			console.log(`Insertada ${rs.rowsAffected} fila(s) en temporada. LastInsertRowId: ${rs.lastInsertRowid}`)

			if(rs.rowsAffected > 0 && rs.lastInsertRowid) {
				console.log(`Insertando configuraciones por defecto para la temporada ${rs.lastInsertRowid}`)
				const rsConfig1 = await transaction.execute({
					sql: "INSERT INTO config(key, value, temporada_id) VALUES(?, ?, ?)",
					args: ['aportacion.inicial', '200', rs.lastInsertRowid],
				})
				console.log(`Insertada ${rsConfig1.rowsAffected} fila(s) en config 'aportacion.inicial'`)

				const rsConfig2 = await transaction.execute({
					sql: "INSERT INTO config(key, value, temporada_id) VALUES(?, ?, ?)",
					args: ['max.importe.apuestas','3', rs.lastInsertRowid],
				})
				console.log(`Insertada ${rsConfig2.rowsAffected} fila(s) en config 'max.importe.apuestas'`)
			}
			await transaction.commit();
			return rs.rowsAffected
		} catch (e) {
			console.error(e)
			console.log("Error al insertar temporada, se hace rollback")
			await transaction.rollback();
			return 0
		}
	}

	/**
	 * Elimina una temporada
	 * @param id
	 * @returns
	 */
	async delete(id: number): Promise<number> {
		const transaction = await turso.transaction("write");
		try {
			const rsConfig = await transaction.execute({
				sql: "DELETE FROM config WHERE temporada_id = ?",
				args: [id],
			})
			console.log(`Eliminada ${rsConfig.rowsAffected} fila(s) en config. TemporadaId: ${id}`)

			const { rowsAffected } = await transaction.execute({
				sql: "DELETE FROM temporada WHERE id = ?",
				args: [id],
			})
			console.log(`Eliminada ${rowsAffected} fila(s) en temporada. TemporadaId: ${id}`)

			await transaction.commit();
			return rowsAffected
		} catch (e) {
			console.error(e)
			console.log("Error al eliminando temporada, se hace rollback")
			await transaction.rollback();
			return 0
		}
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
