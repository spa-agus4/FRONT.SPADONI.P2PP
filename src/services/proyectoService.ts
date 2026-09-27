import type { Proyecto, ProyectoDatosDTO } from '../types/index'
import { apiClient } from './api/apiClient'

export const listarProyectos = (): Promise<Proyecto[]> => {
    return apiClient<Proyecto[]>('/api/proyectos', {
        method: 'GET'
    })
}

export const crearProyecto = (datos: ProyectoDatosDTO): Promise<Proyecto> => {
    return apiClient<Proyecto>('/api/proyectos', {
        method: 'POST',
        body: JSON.stringify(datos)
    })
}

export const actualizarProyecto = (id: number, datos: ProyectoDatosDTO): Promise<Proyecto> => {
    return apiClient<Proyecto>(`/api/proyectos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(datos)
    })
}

export const eliminarProyecto = (id: number): Promise<void> => {
    return apiClient<void>(`/api/proyectos/${id}`, {
        method: 'DELETE'
    })
}

export const obtenerProyectoPorId = (id: number): Promise<Proyecto> => {
    return apiClient<Proyecto>(`/api/proyectos/${id}`, {
        method: 'GET'
    })
}