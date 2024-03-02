export interface User {
    id: number,
    nombre: string,
    team: Team,
    apuestas?: Apuesta[]
    ganancia?: number,
    puntos?: number
}
export interface Team {
    id: number,
    nombre: string,
    users?: User[],
    color: string,
    puntos?: number
}

export interface Estado {
    id: number,
    nombre: string
}

export interface Apuesta {
    id: number,
    user: User,
    descripcion: string,
    importe: number,
    cuota: number,
    estado: number
}