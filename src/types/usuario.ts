import type { Rol } from './auth'

export interface UsuarioAltaDTO {
    nombreUsuario: string
    contrasena: string
    rol: 'GERENTE' | 'ADMINISTRADOR'
}

export interface RespuestaActualizacion {
    usuarioDTO: UsuarioListadoDTO;
    token: string;
}

// Base para todos los tipos de usuario
export interface Usuario {
    id: number
    nombreUsuario: string | null
    rol: Rol
    activo: boolean
}

export interface UsuarioListadoDTO {
    usuario: Usuario
    datosCliente: RespuestaDatosClienteDTO
}

export interface RespuestaDatosClienteDTO {
    nombre: string
    direccion: string
    email: string
    telefono: string
}