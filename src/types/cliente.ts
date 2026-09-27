import type {Usuario} from './usuario'

// Extensión específica para cuando el usuario es un CLIENTE
export interface Cliente extends Usuario {
    rol: 'CLIENTE' // Forzamos el rol
    nombre: string
    direccion: string
    email: string
    telefono: string
}

export interface ClienteDatosDTO {
    nombre: string
    telefono: string
    email: string
    direccion: string
}