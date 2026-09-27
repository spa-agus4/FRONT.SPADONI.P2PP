import type {Cliente} from './cliente'

export interface ProyectoDatosDTO {
    nombre: string
    clienteId: number
    canalSolicitud: canalSolicitud
    fechaInicio: string | null
    fechaFinalizacion: string | null
    presupuesto: number
    estadoProyecto: EstadoProyecto
    estadoProceso: EstadoProceso 
}

export interface Proyecto {
    id: number
    nombre: string
    cliente: Cliente
    canalSolicitud: canalSolicitud
    fechaInicio: Date | null
    fechaFinalizacion: Date | null
    presupuesto: number
    estadoProyecto: EstadoProyecto
    estadoProceso: EstadoProceso  
}


// Mejor los creo aparte por si el dia de mañana cambio los estados
export type EstadoProyecto = 'PLANIFICACION' | 'DISENO' | 'DESARROLLO' | 'PRUEBAS' | 'ENTREGA'
export type EstadoProceso = 'EN_CURSO' | 'COMPLETADO' | 'CANCELADO'

export type canalSolicitud = 'EMAIL' | 'TELEFONO' | 'PRESENCIAL'

export const ETAPAS: Record<EstadoProyecto, string> = {
    PLANIFICACION: 'Planificación',
    DISENO: 'Diseño',
    DESARROLLO: 'Desarrollo',
    PRUEBAS: 'Pruebas',
    ENTREGA: 'Entrega'
}