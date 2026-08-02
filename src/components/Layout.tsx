import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import type { Usuario } from '../types'

import FormularioUsuario from './administrador/FormularioUsuario'
import AdminUsuarios from './administrador/AdminUsuarios'
import AdminDesarrolladores from './administrador/AdminDesarrolladores'

import GerenteProyectos from './gerente/GerenteProyectos'
import GerenteClientes from './gerente/GerenteClientes'

import ClienteProyectos from './cliente/ClienteProyectos'

import { Box, Typography } from '@mui/material'
import { useNotification } from '../context/NotificationContext'
import Notification from './shared/Notification'


export default function Layout() {
    const { nombreUsuario, rol, cerrarSesion } = useAuth()
    const navigate = useNavigate()
    const [seccionActiva, setSeccionActiva] = useState('')
    const { open, message, severity, setOpen } = useNotification() // Traemos el estado

    // Guarda temporalmente el ID del cliente al que queremos saltar
    const [clienteFiltroInicial, setClienteFiltroInicial] = useState<number | 'TODOS'>('TODOS')

    // Al cambiar manualmente de sección en el menú lateral, limpiamos el filtro previo
    const handleCambioSeccion = (value: string) => {
        setClienteFiltroInicial('TODOS');
        setSeccionActiva(value);
    }
    useEffect(() => {
        if (rol) {
            // Buscamos las opciones que le corresponden a este rol
            const opcionesDisponibles = opcionesPorRol[rol];

            // Si tiene opciones y aún no hemos activado ninguna, 
            // ponemos la primera de la lista por defecto
            if (opcionesDisponibles && opcionesDisponibles.length > 0 && seccionActiva === '') {
                setSeccionActiva(opcionesDisponibles[0].value);
            }
        }
    }, [rol]); // Se ejecuta cuando el rol carga o cambia

    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                setOpen(false);
            }, 5000); // Se cierra solo en 5 segundos
            return () => clearTimeout(timer);
        }
    }, [open]);

    const opcionesPorRol = {
        'ADMINISTRADOR': [
            { label: 'Listar Usuarios', value: 'usuarios' },
            { label: 'Listar Desarrolladores', value: 'desarrolladores' },
            //{ label: 'Editar Perfil', value: 'perfil' }
        ],
        'GERENTE': [
            { label: 'Listar Proyectos', value: 'proyectos' },
            { label: 'Listar Clientes', value: 'clientes' },
            //{ label: 'Editar Perfil', value: 'perfil' }
        ],
        'CLIENTE': [
            { label: 'Mis Proyectos', value: 'proyectos' },
            //{ label: 'Editar Perfil', value: 'perfil' }
        ]
    }

    const opciones = rol ? opcionesPorRol[rol] : []

    const coloresPorRol = {
        'ADMINISTRADOR': '#d32f2f',  // rojo
        //'GERENTE': '#388e3c',        // verde
        'GERENTE': '#f57c00',        // verde
        //'CLIENTE': '#f57c00'         // naranja
        'CLIENTE': '#00a7f5'         // celeste
    }

    const colorFranja = rol ? coloresPorRol[rol] : '#000'

    const handleCerrarSesion = () => {
        cerrarSesion()
        navigate('/')
    }

    return (
        <Box sx={{
            width: '80%',
            minHeight: '90vh',
            margin: '40px auto',
            border: '3px solid #000',
            borderRadius: 3,
            overflow: 'hidden',
            fontStyle: 'oblique',
            fontWeight: 'bold',
            backgroundColor: '#d4d4d5'
        }}>

            {/* Header negro con título */}
            <Box sx={{
                backgroundColor: '#000',
                padding: 4,
            }}>
                <Typography variant="h2" sx={{ color: '#fff', fontWeight: 'bold' }}>
                    Buen Programador
                </Typography>
            </Box>

            {/* Franja de color según rol */}
            <Box sx={{
                backgroundColor: colorFranja,
                padding: '8px 16px',
                display: 'flex',
                justifyContent: 'space-between', // Esto mantiene los elementos en las puntas
                alignItems: 'center',
                minHeight: '60px' // Altura fija para que no "salte" la franja cuando aparece el aviso
            }}>

                {/* 1. LADO IZQUIERDO: Información del Usuario */}
                <Typography sx={{ color: '#000', fontSize: 25 }}>
                    Ingresó como el usuario: {nombreUsuario}
                </Typography>

                {/* 2. LADO DERECHO: Box de Aviso O Botón Salir */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {open ? (
                        <Notification
                            message={message}
                            severity={severity}
                            onClose={() => setOpen(false)}
                        />
                    ) : (
                        <Typography
                            onClick={handleCerrarSesion}
                            sx={{
                                fontSize: 25,
                                color: '#000',
                                cursor: 'pointer',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            Salir
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Contenido con padding */}
            <Box sx={{ display: 'flex', minHeight: 500 }}>
                <Box sx={{ width: 350, borderRight: '1px solid #ccc', padding: 2 }}>
                    {opciones.map(op => (
                        <Typography
                            key={op.value}
                            onClick={() => handleCambioSeccion(op.value)}
                            sx={{
                                fontSize: 30,
                                cursor: 'pointer',
                                padding: '8px 0',
                                fontWeight: seccionActiva === op.value ? 'bold' : 'normal',
                                color: seccionActiva === op.value ? colorFranja : '#000',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            {op.label}
                        </Typography>
                    ))}
                </Box>
                <Box sx={{ flex: 1, padding: 3 }}>

                    {/* ADMIN */}
                    {seccionActiva === 'usuarios' && <AdminUsuarios />}
                    {seccionActiva === 'desarrolladores' && <AdminDesarrolladores />}

                    {/* CLIENTE */}
                    {seccionActiva === 'proyectos' && rol === 'CLIENTE' && (
                        <ClienteProyectos />
                    )}

                    {/* GERENTE */}
                    {seccionActiva === 'proyectos' && rol === 'GERENTE' && (
                        <GerenteProyectos
                            filtroInicial={clienteFiltroInicial} // <-- Le pasamos el filtro que viene desde la carpeta
                        />
                    )}
                    {seccionActiva === 'clientes' && (
                        <GerenteClientes
                            onVerProyectosCliente={(id: number) => {
                                setClienteFiltroInicial(id);      // 1. Seteamos el ID del cliente seleccionado
                                setSeccionActiva('proyectos');    // 2. Saltamos a la sección de proyectos
                            }}
                        />
                    )}

                    {/* USUARIO 
                    {seccionActiva === 'perfil' && (
                        <FormularioUsuario
                            usuario={{
                                nombreUsuario: nombreUsuario,
                                rol: rol
                            } as Usuario}
                            onGuardar={(datos) => console.log("Actualizando perfil:", datos)}
                            onCancelar={() => setSeccionActiva(opcionesPorRol[rol!][0].value)}
                        />
                    )*/}

                </Box>
            </Box>
        </Box>
    )
}