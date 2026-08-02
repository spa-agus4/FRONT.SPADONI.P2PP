import type { Cliente, ClienteDatosDTO } from '../types/index'

const API_URL = import.meta.env.VITE_API_URL

export const listarClientes = async (token: string): Promise<Cliente[]> => {
    const response = await fetch(`${API_URL}/api/clientes`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) {
        throw new Error('No se pudo listar los clientes')
    }
    return response.json()
}

export const crearCliente = async (token: string, datos: ClienteDatosDTO): Promise<Cliente> => {
    const response = await fetch(`${API_URL}/api/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(datos)
    })
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'No se pudo crear el cliente');
    }
    return response.json()
}

export const actualizarCliente = async (token: string, id: number, datos: ClienteDatosDTO): Promise<Cliente> => {
    const response = await fetch(`${API_URL}/api/clientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(datos)
    })
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'No se pudo actualizar el cliente');
    }
    return response.json()
}

export const eliminarCliente = async (token: string, id: number): Promise<Cliente | null> => {
    const response = await fetch(`${API_URL}/api/clientes/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'No se pudo eliminar el cliente');
    }
    if (response.status === 204) {
        return null
    }
    return await response.json()
}

export const habilitarCliente = async (token: string, id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/api/clientes/${id}/habilitar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'No se pudo habilitar el cliente');
    }
}