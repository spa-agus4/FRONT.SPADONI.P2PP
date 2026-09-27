import type { Desarrollador, DesarrolladorAltaDTO, DesarrolladorEdicionDTO } from '../types'
import { apiClient } from './api/apiClient'

export const listarDesarrolladores = (): Promise<Desarrollador[]> => {
    return apiClient<Desarrollador[]>('/api/desarrolladores', {
        method: 'GET'
    })
}

export const listarDesarrolladoresPorProyecto = (proyectoId: number): Promise<Desarrollador[]> => {
    return apiClient<Desarrollador[]>(`/api/desarrolladores/proyecto/${proyectoId}`, {
        method: 'GET'
    })
}

export const crearDesarrollador = (datos: DesarrolladorAltaDTO): Promise<Desarrollador> => {
    return apiClient<Desarrollador>('/api/desarrolladores', {
        method: 'POST',
        body: JSON.stringify(datos)
    })
}

export const eliminarDesarrollador = (id: number) => {
    return apiClient<void>(`/api/desarrolladores/${id}`, {
        method: 'DELETE'
    })
}

export const actualizarDesarrollador = (id: number, datos: DesarrolladorEdicionDTO): Promise<Desarrollador> => {
    return apiClient<Desarrollador>(`/api/desarrolladores/${id}`, {
        method: 'PUT',
        body: JSON.stringify(datos)
    })
}

export const asignarDesarrolladoresAProyecto = (proyectoId: number, desarrolladoresIds: number[]): Promise<void> => {
    return apiClient<void>(`/api/desarrolladores/proyecto/${proyectoId}/asignar`, {
            method: 'POST',
            body: JSON.stringify(desarrolladoresIds)
        })
}