import type { Session } from "@auth/core/types"
import { turso } from "@/turso"
import { ParticipanteVO, UserVO } from "@/lib/model"

export class UserService {
	constructor() {}

	/**
	 * Devuelve true si no hay sesión o si el email de la sesión corresponde con el de un usuario
	 * @param session
	 * @returns
	 */
	async isUserAuthorized(session: Session | null) {
		if (!session) return true
		const email = session?.user?.email ?? null
		const { rows } = await turso.execute({
			sql: "SELECT * FROM user WHERE email = ?",
			args: [email],
		})

		return rows.length > 0
	}

	/**
	 * Devuelve true si el usuario logado es admin
	 * @param session
	 * @returns
	 */
	async isAdmin(session: Session | null) {
		if (!session) {
			return false
		}
		const emailUser = session?.user?.email ?? null

		const { rows: rowsUser } = await turso.execute({
			sql: "SELECT * FROM user WHERE email = ? and admin = 1",
			args: [emailUser],
		})
		return rowsUser.length > 0
	}

	/**
	 * Obtiene la lista de participantes con los equipos a los que pertenecen
	 * @returns
	 */
	async getParticipantesTeam(idTemporada: number | undefined): Promise<ParticipanteVO[]> {
		if (!idTemporada) return []
		const { rows } = await turso.execute({
			sql: "SELECT p.id, u.id as userId, u.nombre as userNombre, t.id as teamId, t.nombre as teamNombre FROM user u INNER JOIN participante p on p.user_id = u.id and p.temporada_id = ? LEFT JOIN team t on t.id = P.team_id order by u.nombre asc",
			args: [idTemporada],
		})

		let result: ParticipanteVO[] = []
		result = rows.map((r) => {
			return ParticipanteVO.toVO(r)
		})

		return result
	}

	/**
	 * Obtiene la lista de usuarios
	 * @returns
	 */
	async getparticipantes(idTemporada: number | undefined): Promise<ParticipanteVO[]> {
		if (!idTemporada) return []
		const { rows } = await turso.execute({
			sql: "SELECT p.id, u.id as userId, u.nombre as userNombre FROM participante p INNER JOIN user u on p.user_id = u.id and p.temporada_id = ? order by u.nombre",
			args: [idTemporada],
		})

		let result: ParticipanteVO[] = []
		result = rows.map((r) => {
			return ParticipanteVO.toVO(r)
		})

		return result
	}

	/**
	 * Obtiene el número de usuarios en el sistema
	 * @returns
	 */
	async getNumUsers(idTemporada: number | undefined): Promise<number> {
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
	 * Obtiene el participante con el email indicado
	 * @param email
	 * @returns
	 */
	async getParticipanteByEmail(email: string, idTemporada: number): Promise<UserVO | null> {
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
	 * @returns
	 */
	async getParticipanteByTelegram(telegramId: number, idTemporada: number): Promise<UserVO | null> {
		const { rows: rowsParticipante } = await turso.execute({
			sql: "SELECT p.id, u.id as userId, u.nombre  as userNombre, t.id as teamId, t.nombre as teamNombre FROM participante p  INNER JOIN user u on p.user_id = u.id and p.temporada_id = ? LEFT JOIN team t on t.id = p.team_id WHERE u.telegramId = ?",
			args: [idTemporada, telegramId],
		})
		if (!rowsParticipante[0]) return null

		let result = ParticipanteVO.toVO(rowsParticipante[0])
		return result
	}
}
