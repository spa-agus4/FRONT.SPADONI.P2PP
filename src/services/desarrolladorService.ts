import type { Desarrollador, DesarrolladorAltaDTO, DesarrolladorEdicionDTO } from '../types'

const API_URL = import.meta.env.VITE_API_URL

export const listarDesarrolladores = async (token: string): Promise<Desarrollador[]> => {

    const response = await fetch(`${API_URL}/api/desarrolladores`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error('No se pudo listar los desarrolladores')
    }

    return response.json()
}

export const listarDesarrolladoresPorProyecto = async (token: string, proyectoId: number): Promise<Desarrollador[]> => {
    const response = await fetch(`${API_URL}/api/desarrolladores/proyecto/${proyectoId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('No se pudieron obtener los desarrolladores del proyecto');
    }

    return response.json();
};

export const crearDesarrollador = async (token: string, datos: DesarrolladorAltaDTO): Promise<Desarrollador> => {

    const response = await fetch(`${API_URL}/api/desarrolladores`, {
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
        throw new Error(errorData.message || 'No se pudo crear el desarrollador');
    }

    return response.json()
}

export const eliminarDesarrollador = async (token: string, id: number) => {

    const response = await fetch(`${API_URL}/api/desarrolladores/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error('No se pudo eliminar el desarrollador')
    }
}

export const actualizarDesarrollador = async (token: string, id: number, datos: DesarrolladorEdicionDTO): Promise<Desarrollador> => {
    const response = await fetch(`${API_URL}/api/desarrolladores/${id}`, {
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
        throw new Error(errorData.message || 'No se pudo actualizar el desarrollador');
    }

    return response.json()
}

export const asignarDesarrolladoresAProyecto = async (token: string, proyectoId: number, desarrolladoresIds: number[]): Promise<void> => {
    const response = await fetch(`${API_URL}/api/desarrolladores/proyecto/${proyectoId}/asignar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(desarrolladoresIds)
    });

    if (!response.ok) {
        throw new Error('No se pudo guardar la asignación de desarrolladores');
    }
};