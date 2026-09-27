import type {Proyecto} from './proyecto'

export interface DesarrolladorAltaDTO {
    nombre: string
    habilidades?: string
}

export interface DesarrolladorEdicionDTO {
    nombre?: string
    habilidades?: string
    disponible?: boolean
}

export interface Desarrollador {
    id: number
    nombre: string
    proyecto: Proyecto | null
    habilidades: string
    disponible: boolean
}