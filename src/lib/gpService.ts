import { turso } from "@/turso"
import { GpVO } from "@/lib/model"

export class GpService {
	constructor() {}

	async getAllGp() {
		const { rows: gpRows } = await turso.execute("SELECT * FROM gp order by id asc")

		let result: GpVO[] = []
		result = gpRows.map((r) => {
			return GpVO.toVO(r)
		})

		return result
	}

	async getGp(id: number) {
		const { rows: gpRows } = await turso.execute({
			sql: "SELECT * FROM gp WHERE id = ?",
			args: [id],
		})
		if (gpRows.length > 0) {
			return GpVO.toVO(gpRows[0])
		}

		return new GpVO()
	}
}
