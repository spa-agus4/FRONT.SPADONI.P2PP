import type { Usuario, CredencialesDTO, UsuarioAltaDTO, RespuestaActualizacion, UsuarioListadoDTO } from '../types'
import { apiClient } from './api/apiClient'


export const crearUsuario = (datos: UsuarioAltaDTO): Promise<UsuarioListadoDTO> => {
    return apiClient<UsuarioListadoDTO>('/api/usuarios', {
        method: 'POST',
        body: JSON.stringify(datos)
    })
}

export const habilitarUsuario = (id: number): Promise<void> => {
    return apiClient<void>(`/api/usuarios/${id}/habilitar`, {
        method: 'PUT'
    })
}

export const actualizarUsuario = (id: number, datos: CredencialesDTO): Promise<RespuestaActualizacion> => {
    return apiClient<RespuestaActualizacion>(`/api/usuarios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(datos)
    })
}

export const eliminarUsuario = (id: number): Promise<UsuarioListadoDTO | null> => {
    return apiClient<UsuarioListadoDTO | null>(`/api/usuarios/${id}`, {
        method: 'DELETE'
    })
}

export const listarUsuarios = (): Promise<UsuarioListadoDTO[]> => {
    return apiClient<UsuarioListadoDTO[]>('/api/usuarios', {
        method: 'GET'
    })
}