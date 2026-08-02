import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { token } = useAuth()

    if (!token) {
        return <Navigate to="/" />
    }

    return children
}

export default PrivateRoute