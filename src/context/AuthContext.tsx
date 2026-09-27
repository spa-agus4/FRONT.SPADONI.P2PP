import { createContext, useState, useContext, useEffect } from 'react' // Importamos useEffect
import { jwtDecode } from 'jwt-decode'
import {type Rol, type AuthContextType} from '../types/auth.ts'

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    
    const [id, setId] = useState<number | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [rol, setRol] = useState<Rol | null>(null)
    const [nombreUsuario, setNombreUsuario] = useState<string | null>(null)
    const [cargando, setCargando] = useState(true) // <--- Empieza en true

    // Este efecto se ejecuta UNA VEZ cuando se abre la app o se hace F5
    useEffect(() => {
        const tokenGuardado = localStorage.getItem('token')
        if (tokenGuardado) {
            try {
                // Si hay token, lo cargamos al estado de nuevo
                const decoded = jwtDecode<{ rol: Rol, id: number, sub: string }>(tokenGuardado)
                setToken(tokenGuardado)
                setRol(decoded.rol)
                setId(decoded.id)
                setNombreUsuario(decoded.sub)
            } catch (error) {
                console.error("Token inválido", error)
                localStorage.removeItem('token')
            }
        }
        setCargando(false) // Terminó de chequear, ya no está cargando
    }, [])

    const iniciarSesion = (token: string) => {
        localStorage.setItem('token', token) // <--- Guardamos físicamente
        setToken(token)
        const decoded = jwtDecode<{ rol: Rol, id: number, sub: string }>(token)
        setRol(decoded.rol)
        setId(decoded.id)
        setNombreUsuario(decoded.sub)
    }

    const cerrarSesion = () => { 
        localStorage.removeItem('token') // <--- Borramos el token
        setToken(null)
        setRol(null)
        setId(null) 
        setNombreUsuario(null) 
    }
    
    return (
        <AuthContext.Provider value={{ token, nombreUsuario, rol, id, cargando, iniciarSesion, cerrarSesion }}>
            {/* Si está cargando, no mostramos nada (o un spinner) para evitar rebotes de ruta */}
            {!cargando ? children : <div style={{backgroundColor: '#d4d4d5', height: '100vh'}}>Cargando sistema...</div>}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
    return context
}