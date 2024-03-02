export interface User {
    id: number,
    nombre: string,
    team: Team,
    apuestas?: Apuesta[]
}
export interface Team {
    id: number,
    nombre: string,
    users?: User[],
    color: string
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