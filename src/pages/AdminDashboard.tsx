import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import type { Usuario, Desarrollador } from '../types'
import { listarUsuarios } from '../services/usuarioService'
import { listarDesarrolladores } from '../services/desarrolladorService'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'

function AdminDashboard(){
    const token = useAuth()
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [desarrolladores, setDesarrolladores] = useState<Desarrollador[]>([]) 

    useEffect(() => {
        if (!token.token) return
        listarUsuarios(token.token).then(data => setUsuarios(data))
        listarDesarrolladores(token.token).then(data => setDesarrolladores(data))
    }, [])

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Columna 1</TableCell>
                    <TableCell>Columna 2</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {usuarios.map(u => (
                    <TableRow key={u.id}>
                        <TableCell>{u.nombreUsuario}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default AdminDashboard