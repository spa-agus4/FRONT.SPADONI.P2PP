import type { LoginForm, TokenResponse } from '../types'
import { apiClient } from './api/apiClient'

export const login = (credenciales: LoginForm): Promise<TokenResponse> => {
    return apiClient<TokenResponse>('/api/auth/ingresar', {
        method: 'POST',
        body: JSON.stringify(credenciales)
    })
}