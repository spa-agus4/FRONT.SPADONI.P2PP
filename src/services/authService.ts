import type { LoginForm, TokenResponse } from '../types'

const API_URL = import.meta.env.VITE_API_URL

export const login = async (credenciales: LoginForm): Promise<TokenResponse> => {
    const response = await fetch(`${API_URL}/api/auth/ingresar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciales)
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Credenciales incorrectas');
    }

    return response.json()
}