const API_URL = import.meta.env.VITE_API_URL

export async function apiClient<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {

    const token = localStorage.getItem('token') // obtenemos el token desde el localStorage en vez de pasarlo con useAuth desde el component

    const headers = new Headers(options.headers)

    headers.set('Content-Type', 'application/json')

    if(token)
        headers.set('Authorization', `Bearer ${token}`)

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    })

    if(!response.ok){
        let message = 'Ocurrió un error al comunicarse con el servidor'

        try{
            const errorData = await response.json()

            if(errorData.message)
                message = errorData.message
            
        } catch {
            // La respuesta no tenia JSON
        }

        throw new Error(message)
    }

    if(response.status === 204)
        return undefined as T

    return response.json()
}