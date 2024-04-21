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

	async getUsersTeam() {
		const { rows } = await turso.execute(
			"SELECT u.id, u.nombre, t.id as teamId, t.nombre as teamNombre FROM user u left JOIN team t on t.id = u.teamId order by u.nombre asc"
		)

		let result: UserVO[] = []
		result = rows.map((r) => {
			return UserVO.toVO(r)
		})

		return result
	}

	async getUsers() {
		const { rows } = await turso.execute("SELECT u.id, u.nombre FROM user u order by u.nombre")

		let result: UserVO[] = []
		result = rows.map((r) => {
			return UserVO.toVO(r)
		})

		return result
	}

	async getUserByEmail(email: string) {
		const { rows: rowsUser } = await turso.execute({
			sql: "SELECT * FROM user WHERE email = ?",
			args: [email],
		})
		if (!rowsUser[0]) return

		let result = UserVO.toVO(rowsUser[0])
		return result
	}
}
