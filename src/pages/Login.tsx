import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Typography, Alert } from '@mui/material'
import { login } from '../services/authService'
import type { LoginForm } from '../types'
import { useAuth } from '../context/AuthContext'
import { traducirError } from '../utils/errorManager'
import CampoTexto from '../components/shared/CampoTexto'

function Login() {
    const navigate = useNavigate()
    const [form, setForm] = useState<LoginForm>({ nombreUsuario: '', contrasena: '' })
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const { iniciarSesion, cerrarSesion } = useAuth()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        // 1. Validación local rápida
        if (!form.nombreUsuario.trim() || !form.contrasena.trim()) {
            setError('Por favor, completa todos los campos');
            return; // Cortamos acá, no llamamos a la API
        }

        setLoading(true)
        setError(null)
        try {
            const response = await login(form)
            iniciarSesion(response.token)
            localStorage.setItem('token', response.token)
            navigate('/dashboard')
        } catch (e) {
            setError(traducirError(e));
            //setError('Usuario o contraseña incorrectos')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cerrarSesion()
    }, [])

    return (
        <Box sx={{
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Box sx={{
                width: 380,
                border: '3px solid #000',
                borderRadius: 3,
                overflow: 'hidden'
            }}>
                {/* Header negro con título */}
                <Box sx={{
                    backgroundColor: '#000',
                    padding: 2,
                    textAlign: 'center'
                }}>
                    <Typography variant="h5" sx={{ color: '#fff' }}>
                        Iniciar sesión
                    </Typography>
                </Box>

                {/* Formulario con fondo gris */}
                <Box sx={{
                    backgroundColor: '#d4d4d5',
                    padding: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <CampoTexto
                        label="Usuario"
                        name="nombreUsuario"
                        value={form.nombreUsuario}
                        onChange={handleChange}
                        maxLength={30}
                    />
                    <CampoTexto
                        label="Contraseña"
                        name="contrasena"
                        type="password"
                        value={form.contrasena}
                        onChange={handleChange}
                        maxLength={50}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{ backgroundColor: '#388e3c', '&:hover': { backgroundColor: '#2e7d32' } }}
                    >
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default Login