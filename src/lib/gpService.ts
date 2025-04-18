import { turso } from "@/turso"
import { GpVO } from "@/lib/model"

export class GpService {
	constructor() {}

	/**
	 * Obtiene la lista de todos los GP de las temporadas pasadas ordeandos por fecha de carrera ASC
	 * @returns
	 */
	async getAllGpByTempsArchive() {
		const { rows: gpRows } = await turso.execute(
			"SELECT * FROM gp WHERE temporada_id in (SELECT id FROM temporada order by id desc limit -1 OFFSET 1) order by carrera asc"
		)

		let result: GpVO[] = []
		result = gpRows.map((r) => {
			return GpVO.toVO(r)
		})

		return result
	}

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
			sql:
				"SELECT g.id, g.nombre, g.flag, g.circuit, g.libres1, g.libres2, g.libres3, " +
				"g.clasificacion, g.clasificacionSprint, g.sprint, g.carrera, g.limite_apostar, t.id as temporadaId, t.nombre as temporadaNombre " +
				"FROM gp g " +
				"INNER JOIN temporada t on t.id = g.temporada_id " +
				"WHERE g.temporada_id = ? order by g.carrera asc",
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
			sql:
				"SELECT g.id, g.nombre, g.flag, g.circuit, g.libres1, g.libres2, g.libres3, " +
				"g.clasificacion, g.clasificacionSprint, g.sprint, g.carrera, g.limite_apostar, t.id as temporadaId, t.nombre as temporadaNombre " +
				"FROM gp g " +
				"INNER JOIN temporada t on t.id = g.temporada_id " +
				"WHERE g.id = ?",
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
			"SELECT g.id, g.nombre, g.flag, g.circuit, g.libres1, g.libres2, g.libres3, " +
				"g.clasificacion, g.clasificacionSprint, g.sprint, g.carrera, g.limite_apostar, t.id as temporadaId, " +
				"t.nombre as temporadaNombre  " +
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

	/** Inserta un nuevo GP
	 * @param nombre
	 * @param flag
	 * @param circuit
	 * @param libres1
	 * @param libres2
	 * @param libres3
	 * @param clasificacion
	 * @param clasificacionSprint
	 * @param sprint
	 * @param carrera
	 * @param temporadaId
	 * @returns
	 */
	async insert(
		nombre: string,
		flag: string,
		circuit: string,
		libres1: string,
		libres2: string | null,
		libres3: string | null,
		clasificacion: string,
		clasificacionSprint: string | null,
		sprint: string | null,
		carrera: string,
		limite_apostar: string | null,
		temporadaId: number
	): Promise<number> {
		const { rowsAffected } = await turso.execute({
			sql:
				"INSERT INTO gp (nombre, flag, circuit, libres1, libres2, libres3, clasificacion, clasificacionSprint, sprint, carrera, limite_apostar, temporada_id) " +
				" VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
			args: [
				nombre,
				flag,
				circuit,
				libres1,
				libres2,
				libres3,
				clasificacion,
				clasificacionSprint,
				sprint,
				carrera,
				limite_apostar,
				temporadaId,
			],
		})
		return rowsAffected
	}

	/**
	 * Elimina un gp
	 * @param id
	 * @returns
	 */
	async delete(id: number): Promise<number> {
		const { rowsAffected } = await turso.execute({
			sql: "DELETE FROM gp WHERE id = ?",
			args: [id],
		})
		return rowsAffected
	}

	/** Actualiza un nuevo GP
	 * @param id
	 * @param nombre
	 * @param flag
	 * @param circuit
	 * @param libres1
	 * @param libres2
	 * @param libres3
	 * @param clasificacion
	 * @param clasificacionSprint
	 * @param sprint
	 * @param carrera
	 * @param limite_apostar
	 * @returns
	 */
	async update(
		id: number,
		nombre: string,
		flag: string,
		circuit: string,
		libres1: string,
		libres2: string | null,
		libres3: string | null,
		clasificacion: string,
		clasificacionSprint: string | null,
		sprint: string | null,
		carrera: string,
		limite_apostar: string | null
	): Promise<number> {
		const { rowsAffected } = await turso.execute({
			sql:
				"UPDATE gp SET nombre = ?, flag = ?, circuit = ?, libres1 = ?, libres2 = ?, libres3 = ?, clasificacion = ?, " +
				"clasificacionSprint = ?, sprint = ?, carrera = ? , limite_apostar = ? WHERE id = ?",
			args: [
				nombre,
				flag,
				circuit,
				libres1,
				libres2,
				libres3,
				clasificacion,
				clasificacionSprint,
				sprint,
				carrera,
				limite_apostar,
				id,
			],
		})
		return rowsAffected
	}
}
