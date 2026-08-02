export interface LoginForm {
    nombreUsuario: string
    contrasena: string
}

export interface CredencialesDTO {
    nombreUsuario?: string
    contrasena?: string
}

export interface UsuarioAltaDTO {
    nombreUsuario: string
    contrasena: string
    rol: 'GERENTE' | 'ADMINISTRADOR'
}

export interface DesarrolladorAltaDTO {
    nombre: string
    habilidades?: string
}

export interface DesarrolladorEdicionDTO {
    nombre?: string
    habilidades?: string
    disponible?: boolean
}

export interface ProyectoDatosDTO {
    nombre: string
    clienteId: number
    canalSolicitud: 'EMAIL' | 'TELEFONO' | 'PRESENCIAL'
    fechaInicio: string | null
    fechaFinalizacion: string | null
    presupuesto: number
    estadoProyecto: EstadoProyecto
    estadoProceso: EstadoProceso 
}

export interface TokenResponse {
    token: string
}

// Base para todos los tipos de usuario
export interface Usuario {
    id: number
    nombreUsuario: string | null
    rol: 'CLIENTE' | 'GERENTE' | 'ADMINISTRADOR'
    activo: boolean
}

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

export interface Proyecto {
    id: number
    nombre: string
    cliente: Cliente
    canalSolicitud: 'EMAIL' | 'TELEFONO' | 'PRESENCIAL'
    fechaInicio: Date | null
    fechaFinalizacion: Date | null
    presupuesto: number
    estadoProyecto: EstadoProyecto
    estadoProceso: EstadoProceso  
}

export interface Desarrollador {
    id: number
    nombre: string
    proyecto: Proyecto | null
    habilidades: string
    disponible: boolean
}

// Mejor los creo aparte por si el dia de mañana cambio los estados
export type EstadoProyecto = 'PLANIFICACION' | 'DISENO' | 'DESARROLLO' | 'PRUEBAS' | 'ENTREGA'
export type EstadoProceso = 'EN_CURSO' | 'COMPLETADO' | 'CANCELADO'