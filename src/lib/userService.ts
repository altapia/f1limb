import type { Session } from "@auth/core/types"
import { turso } from "@/turso"
import { UserVO } from "@/lib/model"

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

	async getAll(): Promise<UserVO[]> {
		const { rows } = await turso.execute("SELECT * FROM user order by nombre")
		let result: UserVO[] = []
		result = rows.map((r) => {
			return UserVO.toVO(r)
		})

		return result
	}

	/**
	 * Crea un usuario
	 * @param nombre
	 * @returns
	 */
	async create(nombre: string, email: string, admin: boolean, telegramId: number): Promise<number> {
		const { rowsAffected } = await turso.execute({
			sql: "INSERT INTO user(nombre, email, admin, telegramId) VALUES(?, ?, ?, ?)",
			args: [nombre, email, admin, telegramId],
		})

		return rowsAffected
	}

	/**
	 * Elimina un usuario
	 * @param id
	 * @returns
	 */
	async delete(id: number): Promise<number> {
		const { rowsAffected } = await turso.execute({
			sql: "DELETE FROM user WHERE id = ?",
			args: [id],
		})

		return rowsAffected
	}

	/**
	 * Actualiza un usuario
	 * @param id
	 * @param nombre
	 * @param email
	 * @param admin
	 * @param telegramId
	 * @returns
	 */
	async update(
		id: number,
		nombre: string,
		email: string,
		admin: boolean,
		telegramId: number
	): Promise<number> {
		const { rowsAffected } = await turso.execute({
			sql: "UPDATE user SET nombre = ?, email = ?, admin = ?, telegramId = ? WHERE id = ?",
			args: [nombre, email, admin, telegramId, id],
		})

		return rowsAffected
	}
}
