import type { Team, User } from "./model";
import { equipos } from "./teams";

const teams:Team[] = equipos

export const usuarios: User[] = [
    {
        id: 1,
        nombre: 'Tapia',
        team: teams[0]
    },
    {
        id: 2,
        nombre: 'Age',
        team: teams[0]
    },
    {
        id: 3,
        nombre: 'Ketu',
        team: teams[1]
    },
    {
        id: 4,
        nombre: 'Nano',
        team: teams[2]
    },
    {
        id: 5,
        nombre: 'Lucho',
        team: teams[2]
    },
    {
        id: 6,
        nombre: 'Paco',
        team: teams[3]
    },
    {
        id: 7,
        nombre: 'Ori',
        team: teams[1]
    },
    {
        id: 8,
        nombre: 'Vicente',
        team: teams[4]
    },
    {
        id: 9,
        nombre: 'Javi',
        team: teams[4]
    },
    {
        id: 10,
        nombre: 'Rulo',
        team: teams[3]
    },
    {
        id: 11,
        nombre: 'Luis',
        team: teams[5]
    },
    {
        id: 12,
        nombre: 'Jon',
        team: teams[5]
    },
]