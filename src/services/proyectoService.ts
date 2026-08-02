import type { Proyecto, ProyectoDatosDTO } from '../types/index'

const API_URL = import.meta.env.VITE_API_URL

export const listarProyectos = async (token: string): Promise<Proyecto[]> => {

    const response = await fetch(`${API_URL}/api/proyectos`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error('No se pudo listar los proyectos')
    }

    return response.json()
}

export const crearProyecto = async (token: string, datos: ProyectoDatosDTO): Promise<Proyecto> => {

    const response = await fetch(`${API_URL}/api/proyectos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datos)
    })

    if (!response.ok) {
        // 1. Intentamos leer el JSON de error que manda Spring
        const errorData = await response.json().catch(() => ({}));

        // 2. Si el backend mandó un mensaje (errorData.message), usamos ese.
        // Si no, tiramos el genérico.
        throw new Error(errorData.message || 'No se pudo crear el proyecto');
    }

    return response.json()
}

export const eliminarProyecto = async (token: string, id: number) => {

    const response = await fetch(`${API_URL}/api/proyectos/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error('No se pudo eliminar el proyecto')
    }
}

export const actualizarProyecto = async (token: string, id: number, datos: ProyectoDatosDTO): Promise<Proyecto> => {
    const response = await fetch(`${API_URL}/api/proyectos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datos)
    })

    if (!response.ok) {
        // Intentamos parsear el error del backend si existe
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'No se pudo actualizar el proyecto');
    }

    return response.json()
}

export const obtenerProyectoPorId = async (token: string, id: number): Promise<Proyecto> => {
    const response = await fetch(`${API_URL}/api/proyectos/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        // Intentamos parsear el error del backend si existe
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'No se pudo encontrar el proyecto');
    }

    return response.json()
}