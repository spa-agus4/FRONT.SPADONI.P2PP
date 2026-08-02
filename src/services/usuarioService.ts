import type { Usuario, CredencialesDTO, UsuarioAltaDTO } from '../types'

const API_URL = import.meta.env.VITE_API_URL

export interface RespuestaActualizacion {
    usuario: Usuario;
    token: string;
}

export const actualizarUsuario = async (token: string, id: number, datos: CredencialesDTO): Promise<RespuestaActualizacion> => {
    const response = await fetch(`${API_URL}/api/usuarios/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datos)
    });

    if (!response.ok) {
        // Leemos el JSON (que ahora sí va a existir gracias al .properties)
        const errorData = await response.json().catch(() => ({}));

        // Priorizamos el mensaje que configuramos en el backend
        throw new Error(errorData.message || 'Error al procesar la solicitud');
    }

    return response.json();
};

export const habilitarUsuario = async (token: string, id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/api/usuarios/${id}/habilitar`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al procesar la solicitud');
    }
};

export const listarUsuarios = async (token: string): Promise<Usuario[]> => {

    const response = await fetch(`${API_URL}/api/usuarios`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error('No se pudo listar los usuarios')
    }

    return response.json()
}

export const crearUsuario = async (token: string, datos: UsuarioAltaDTO): Promise<Usuario> => {
    const response = await fetch(`${API_URL}/api/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(datos)
    })
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'No se pudo crear el usuario');
    }
    return response.json()
}

export const eliminarUsuario = async (token: string, id: number): Promise<Usuario | null> => {
    const response = await fetch(`${API_URL}/api/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error('No se pudo eliminar el usuario')
    }

    // Si fue 204 No Content (borrado físico), retornamos null
    if (response.status === 204) {
        return null
    }

    // Si fue 200 OK (inhabilitado), parseamos y devolvemos el usuario actualizado
    return await response.json()
}