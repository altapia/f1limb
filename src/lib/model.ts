import type { Row } from "@libsql/client"

export interface User {
	id: number
	nombre?: string
	email?: string
	admin?: boolean
	team?: Team
	apuestas?: Apuesta[]
	ganancia?: number
	puntos?: number
}
export interface Team {
	id: number
	nombre: string
	users?: User[]
	puntos?: number
}

export interface Estado {
	id: number
	nombre: string
}

export interface Apuesta {
	id: number
	user: User
	descripcion: string
	importe: number
	cuota: number
	estado: number
	ganancia: number
	gp: Info
}

export interface Info {
	id: number
	nombre?: string
	flag?: string
	circuit?: string
	libres1?: Date
	libres2?: Date
	libres3?: Date
	clasificacion?: Date
	clasificacionSprint?: Date
	sprint?: Date
	carrera?: Date
}

export interface Clasificacion {
	id: number
	user?: User
	team?: Team
	gp?: Info
	ganancia: number
	puntos: number
}

/*************** */
export class ConfigVO {
	key?: string
	value?: string

	constructor() {}

	static toVO(r: Row) {
		let c = new ConfigVO()
		c.key = r.key as string
		c.value = r.value as string
		return c
	}
}

export class UserVO {
	id?: number
	nombre?: string
	email?: string
	team?: TeamVO
	admin?: boolean
	apuestas?: ApuestaVO[]

	constructor() {}

	static toVO(r: Row) {
		let u = new UserVO()
		u.id = r.id as number
		u.nombre = r.nombre as string
		u.email = r.email as string

		u.team = new TeamVO()
		u.team.id = r.teamId as number
		u.team.nombre = r.teamNombre as string

		u.admin = u.admin as boolean
		return u
	}
}

export class TeamVO {
	id?: number
	nombre?: string

	constructor() {}

	static toVO(r: Row) {
		let t = new TeamVO()
		t.id = r.id as number
		t.nombre = r.nombre as string

		return t
	}
}

export class GpVO {
	id?: number
	nombre?: string
	flag?: string
	circuit?: string
	libres1?: Date
	libres2?: Date
	libres3?: Date
	clasificacion?: Date
	clasificacionSprint?: Date
	sprint?: Date
	carrera?: Date

	constructor() {}

	static toVO(r: Row) {
		let g = new GpVO()
		g.id = r.id as number
		g.nombre = r.nombre as string
		g.flag = r.flag as string
		g.circuit = r.circuit as string
		g.libres1 = new Date(r.libres1 as string)

		if (r.libres2) {
			g.libres2 = new Date(r.libres2 as string)
		}

		if (r.libres3) {
			g.libres3 = new Date(r.libres3 as string)
		}

		if (r.clasificacionSprint) {
			g.clasificacionSprint = new Date(r.clasificacionSprint as string)
		}

		if (r.sprint) {
			g.sprint = new Date(r.sprint as string)
		}

		g.clasificacion = new Date(r.clasificacion as string)
		g.carrera = new Date(r.carrera as string)

		return g
	}
}

export class ClasificacionVO {
	id?: number
	user?: UserVO
	team?: TeamVO
	gp?: GpVO
	ganancia?: number
	puntos?: number
	puesto?: number

	constructor() {}

	static toVO(r: Row) {
		let c = new ClasificacionVO()

		c.id = r.id as number

		c.user = new UserVO()
		c.user.id = r.userId as number
		if (r.userNombre) {
			c.user.nombre = r.userNombre as string
		}

		c.team = new TeamVO()
		c.team.id = r.teamId as number
		if (r.teamNombre) {
			c.team.nombre = r.teamNombre as string
		}

		c.gp = new GpVO()
		c.gp.id = r.gpId as number

		c.ganancia = r.ganancia as number
		c.puntos = r.puntos as number
		c.puesto = r.puesto as number
		return c
	}
}

export class ApuestaVO {
	id?: number
	user?: UserVO
	descripcion?: string
	importe?: number
	cuota?: number
	estado?: number
	ganancia?: number
	gp?: GpVO

	constructor() {}

	static toVO(r: Row) {
		let a = new ApuestaVO()
		a.id = r.id as number

		a.user = new UserVO()
		a.user.id = r.userId as number
		a.user.nombre = r.userNombre as string

		a.gp = new GpVO()
		a.gp.id = r.gpId as number

		a.descripcion = r.descripcion as string
		a.importe = r.importe as number
		a.cuota = r.cuota as number
		a.estado = r.estado as number
		a.ganancia = r.ganancia as number

		return a
	}
}

export class TablaClasificacionVO {
	nombre?: string
	total?: number
	gp1Ptos?: number
	gp1Puesto?: number
	gp2Ptos?: number
	gp2Puesto?: number
	gp3Ptos?: number
	gp3Puesto?: number
	gp4Ptos?: number
	gp4Puesto?: number
	gp5Ptos?: number
	gp5Puesto?: number
	gp6Ptos?: number
	gp6Puesto?: number
	gp7Ptos?: number
	gp7Puesto?: number
	gp8Ptos?: number
	gp8Puesto?: number
	gp9Ptos?: number
	gp9Puesto?: number
	gp10Ptos?: number
	gp10Puesto?: number
	gp11Ptos?: number
	gp11Puesto?: number
	gp12Ptos?: number
	gp12Puesto?: number
	gp13Ptos?: number
	gp13Puesto?: number
	gp14Ptos?: number
	gp14Puesto?: number
	gp15Ptos?: number
	gp15Puesto?: number
	gp16Ptos?: number
	gp16Puesto?: number
	gp17Ptos?: number
	gp17Puesto?: number
	gp18Ptos?: number
	gp18Puesto?: number
	gp19Ptos?: number
	gp19Puesto?: number
	gp20Ptos?: number
	gp20Puesto?: number
	gp21Ptos?: number
	gp21Puesto?: number
	gp22Ptos?: number
	gp22Puesto?: number
	gp23Ptos?: number
	gp23Puesto?: number
	gp24Ptos?: number
	gp24Puesto?: number

	constructor() {}

	static toVO(r: Row) {
		let t = new TablaClasificacionVO()

		t.nombre = r.nombre as string
		t.total = r.total as number
		t.gp1Ptos = r.GP1ptos as number
		t.gp1Puesto = r.GP1 as number
		t.gp2Ptos = r.GP2ptos as number
		t.gp2Puesto = r.GP2 as number
		t.gp3Ptos = r.GP3ptos as number
		t.gp3Puesto = r.GP3 as number
		t.gp4Ptos = r.GP4ptos as number
		t.gp4Puesto = r.GP4 as number
		t.gp5Ptos = r.GP5ptos as number
		t.gp5Puesto = r.GP5 as number
		t.gp6Ptos = r.GP6ptos as number
		t.gp6Puesto = r.GP6 as number
		t.gp7Ptos = r.GP7ptos as number
		t.gp7Puesto = r.GP7 as number
		t.gp8Ptos = r.GP8ptos as number
		t.gp8Puesto = r.GP8 as number
		t.gp9Ptos = r.GP9ptos as number
		t.gp9Puesto = r.GP9 as number
		t.gp10Ptos = r.GP10ptos as number
		t.gp10Puesto = r.GP10 as number
		t.gp11Ptos = r.GP11ptos as number
		t.gp11Puesto = r.GP11 as number
		t.gp12Ptos = r.GP12ptos as number
		t.gp12Puesto = r.GP12 as number
		t.gp13Ptos = r.GP13ptos as number
		t.gp13Puesto = r.GP13 as number
		t.gp14Ptos = r.GP14ptos as number
		t.gp14Puesto = r.GP14 as number
		t.gp15Ptos = r.GP15ptos as number
		t.gp15Puesto = r.GP15 as number
		t.gp16Ptos = r.GP16ptos as number
		t.gp16Puesto = r.GP16 as number
		t.gp17Ptos = r.GP17ptos as number
		t.gp17Puesto = r.GP17 as number
		t.gp18Ptos = r.GP18ptos as number
		t.gp18Puesto = r.GP18 as number
		t.gp19Ptos = r.GP19ptos as number
		t.gp19Puesto = r.GP19 as number
		t.gp20Ptos = r.GP20ptos as number
		t.gp20Puesto = r.GP20 as number
		t.gp21Ptos = r.GP21ptos as number
		t.gp21Puesto = r.GP21 as number
		t.gp22Ptos = r.GP22ptos as number
		t.gp22Puesto = r.GP22 as number
		t.gp23Ptos = r.GP23ptos as number
		t.gp23Puesto = r.GP23 as number
		t.gp24Ptos = r.GP24ptos as number
		t.gp24Puesto = r.GP24 as number
		return t
	}
}
