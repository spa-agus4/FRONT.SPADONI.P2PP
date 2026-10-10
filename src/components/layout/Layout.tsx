import { useState, useEffect, type JSX } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

import AdminUsuarios from '../administrador/adminUsuarios/AdminUsuarios'
import AdminDesarrolladores from '../administrador/adminDevs/AdminDesarrolladores'

import GerenteProyectos from '../gerente/GerenteProyectos'
import GerenteClientes from '../gerente/GerenteClientes'

import ClienteProyectos from '../cliente/ClienteProyectos'

import { Box } from '@mui/material'

import HeaderLayout from './HeaderLayout';
import SidebarLayout from './SidebarLayout';
import { CONFIG_ROLES } from '../../config/roles'


export default function Layout() {
    const { nombreUsuario, rol, cerrarSesion } = useAuth();
    const navigate = useNavigate();
    
    const [seccionActiva, setSeccionActiva] = useState('');
    const [clienteFiltroInicial, setClienteFiltroInicial] = useState<number | 'TODOS'>('TODOS');

    // Resuelve la configuración del rol actual
    const rolActual = rol as keyof typeof CONFIG_ROLES;
    const config = CONFIG_ROLES[rolActual] || { opciones: [], color: '#000' };

    useEffect(() => {
        if (config.opciones.length > 0 && seccionActiva === '') {
            setSeccionActiva(config.opciones[0].value);
        }
    }, [rol, config.opciones, seccionActiva]);

    const handleCambioSeccion = (value: string) => {
        setClienteFiltroInicial('TODOS');
        setSeccionActiva(value);
    };

    const handleCerrarSesion = () => {
        cerrarSesion();
        navigate('/');
    };

    // Diccionario de renderizado
    const renderizarContenido = () => {
        const vistas: Record<string, JSX.Element> = {
            'ADMINISTRADOR-usuarios': <AdminUsuarios />,
            'ADMINISTRADOR-desarrolladores': <AdminDesarrolladores />,
            'GERENTE-proyectos': <GerenteProyectos filtroInicial={clienteFiltroInicial} />,
            'GERENTE-clientes': (
                <GerenteClientes 
                    onVerProyectosCliente={(id: number) => {
                        setClienteFiltroInicial(id);
                        setSeccionActiva('proyectos');
                    }} 
                />
            ),
            'CLIENTE-proyectos': <ClienteProyectos />
        };

        const key = `${rol}-${seccionActiva}`;
        return vistas[key] || null; // Renderiza el componente que haga match
    };

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
            <HeaderLayout 
                nombreUsuario={nombreUsuario!} 
                colorFranja={config.color} 
                onLogout={handleCerrarSesion} 
            />

            <Box sx={{ display: 'flex', minHeight: 500 }}>
                <SidebarLayout 
                    opciones={config.opciones} 
                    seccionActiva={seccionActiva} 
                    colorFranja={config.color} 
                    onChange={handleCambioSeccion} 
                />
                
                <Box sx={{ flex: 1, padding: 3 }}>
                    {renderizarContenido()}
                </Box>
            </Box>
        </Box>
    );
}