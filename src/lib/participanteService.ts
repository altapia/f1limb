import { turso } from "@/turso"
import { ParticipanteVO } from "@/lib/model"

export class ParticipanteService {
	constructor() {}

	/**
	 * Obtiene la lista de participantes de una temporada
	 * @param idTemporada
	 * @returns
	 */
	async getAll(idTemporada: number | undefined): Promise<ParticipanteVO[]> {
		if (!idTemporada) return []
		const { rows } = await turso.execute({
			sql:
				"SELECT p.id, u.id as userId, u.nombre as userNombre, t.id as teamId, t.nombre as teamNombre, temp.id as temporadaId, temp.nombre as temporadaNombre " +
				"FROM participante p " +
				"INNER JOIN user u on p.user_id = u.id " +
				"INNER JOIN team t on p.team_id = t.id " +
				"INNER JOIN temporada temp on p.temporada_id = temp.id " +
				"WHERE p.temporada_id = ? order by u.nombre",
			args: [idTemporada],
		})

		let result: ParticipanteVO[] = []
		result = rows.map((r) => {
			return ParticipanteVO.toVO(r)
		})

		return result
	}

	/**
	 * Obtiene el participante con el email indicado
	 * @param email
	 * @param idTemporada
	 * @returns
	 */
	async getByEmail(email: string, idTemporada: number): Promise<ParticipanteVO | null> {
		const { rows: rowsParticipante } = await turso.execute({
			sql: "SELECT p.id, u.id as userId, u.nombre  as userNombre, t.id as teamId, t.nombre as teamNombre FROM participante p  INNER JOIN user u on p.user_id = u.id and p.temporada_id = ? LEFT JOIN team t on t.id = p.team_id WHERE u.email = ?",
			args: [idTemporada, email],
		})
		if (!rowsParticipante[0]) return null

		let result = ParticipanteVO.toVO(rowsParticipante[0])
		return result
	}

	/**
	 * Obtiene el participante por el id Telegram
	 * @param idTelegram
	 * @param idTemporada
	 * @returns
	 */
	async getByTelegram(telegramId: number, idTemporada: number): Promise<ParticipanteVO | null> {
		const { rows: rowsParticipante } = await turso.execute({
			sql: "SELECT p.id, u.id as userId, u.nombre  as userNombre, t.id as teamId, t.nombre as teamNombre FROM participante p  INNER JOIN user u on p.user_id = u.id and p.temporada_id = ? LEFT JOIN team t on t.id = p.team_id WHERE u.telegramId = ?",
			args: [idTemporada, telegramId],
		})
		if (!rowsParticipante[0]) return null

		let result = ParticipanteVO.toVO(rowsParticipante[0])
		return result
	}

	/**
	 * Obtiene el número de participantes de la temporada
	 * @param idTemporada
	 * @returns
	 */
	async countByTemporada(idTemporada: number | undefined): Promise<number> {
		if (!idTemporada) return 0
		const { rows } = await turso.execute({
			sql: "SELECT count(*) as numUsers FROM user u INNER JOIN participante p on p.user_id = u.id and p.temporada_id = ? ",
			args: [idTemporada],
		})

		if (rows && rows.length > 0) {
			return parseInt(rows[0].numUsers as string)
		}
		return 0
	}

	/**
	 * Inserta un nuevo participante
	 * @param userId
	 * @param teamId
	 * @param temporadaId
	 * @returns
	 */
	async insert(userId: number, teamId: number, temporadaId: number): Promise<number> {
		const { rowsAffected } = await turso.execute({
			sql: "INSERT INTO participante (user_id, team_id, temporada_id) VALUES (?, ?, ?)",
			args: [userId, teamId, temporadaId],
		})
		return rowsAffected
	}

	/**
	 * Elimina un participante
	 * @param id
	 * @returns
	 */
	async delete(id: number): Promise<number> {
		const { rowsAffected } = await turso.execute({
			sql: "DELETE FROM participante WHERE id = ?",
			args: [id],
		})
		return rowsAffected
	}

	/**
	 * Actualiza el equipo de un participante
	 * @param id
	 * @param teamId
	 * @returns
	 */
	async updateTeam(id: number, teamId: number): Promise<number> {
		const { rowsAffected } = await turso.execute({
			sql: "UPDATE participante SET team_id = ? WHERE id = ?",
			args: [teamId, id],
		})
		return rowsAffected
	}
}
