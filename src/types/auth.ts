export type Rol = 'CLIENTE' | 'GERENTE' | 'ADMINISTRADOR'

export interface LoginForm {
    nombreUsuario: string
    contrasena: string
}

export interface CredencialesDTO {
    nombreUsuario?: string
    contrasena?: string
}

export interface TokenResponse {
    token: string
}

export interface AuthContextType {
    token: string | null
    nombreUsuario: string | null
    rol: Rol | null
    id: number | null
    cargando: boolean // <--- Agregamos esto
    iniciarSesion: (token: string) => void
    cerrarSesion: () => void
}