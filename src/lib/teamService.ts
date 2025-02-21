import { turso } from "@/turso"
import { TeamVO } from "@/lib/model"

export class TeamService {
	constructor() {}

	/**
	 * Obtiene la lista de equipos
	 * @returns
	 */
	async getAll(): Promise<TeamVO[]> {
		const { rows } = await turso.execute("SELECT id, nombre FROM team order by nombre")

		let result: TeamVO[] = []
		result = rows.map((r) => {
			return TeamVO.toVO(r)
		})

		return result
	}

	/**
	 * Inserta un nuevo equipo
	 * @param nombre
	 * @returns
	 */
	async insert(nombre: string): Promise<number> {
		const { rowsAffected } = await turso.execute({
			sql: "INSERT INTO team (nombre) VALUES (?)",
			args: [nombre],
		})
		return rowsAffected
	}

	/**
	 * Elimina un equipo
	 * @param id
	 * @returns
	 */
	async delete(id: number): Promise<number> {
		const { rowsAffected } = await turso.execute({
			sql: "DELETE FROM team WHERE id = ?",
			args: [id],
		})
		return rowsAffected
	}

	/**
	 * Actualiza un equipo
	 * @param id
	 * @param nombre
	 * @returns
	 */
	async update(id: number, nombre: string): Promise<number> {
		const { rowsAffected } = await turso.execute({
			sql: "UPDATE team SET nombre = ? WHERE id = ?",
			args: [nombre, id],
		})
		return rowsAffected
	}
}
