import type { Cliente, ClienteDatosDTO } from '../types'
import { apiClient } from './api/apiClient'

export const listarClientes = (): Promise<Cliente[]> => {
    return apiClient<Cliente[]>('/api/clientes', {
        method: 'GET'
    })
}

export const crearCliente = (datos: ClienteDatosDTO): Promise<Cliente> => {
    return apiClient<Cliente>('/api/clientes', {
        method: 'POST',
        body: JSON.stringify(datos)
    })
}

export const actualizarCliente = (id: number, datos: ClienteDatosDTO): Promise<Cliente> => {
    return apiClient<Cliente>(`/api/clientes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(datos)
    })
}

export const eliminarCliente = (id: number): Promise<Cliente | null> => {
    return apiClient<Cliente | null>(`/api/clientes/${id}`, {
        method: 'DELETE'
    })
}

export const habilitarCliente = (id: number): Promise<void> => {
    return apiClient<void>(`/api/clientes/${id}/habilitar`, {
        method: 'PUT'
    })
}