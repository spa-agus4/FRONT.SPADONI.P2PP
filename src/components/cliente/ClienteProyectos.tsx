import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

import type { Proyecto } from '../../types';
import { listarProyectos } from '../../services/proyectoService';

import CardProyecto from '../cards/CardProyecto';
import FormularioProyecto from '../gerente/FormularioProyecto'; // Importamos el formulario
import { useNotification } from '../../context/NotificationContext';

import { TableContainer, Box, Typography, IconButton, Dialog, DialogContent, TextField, InputAdornment, Divider, FormControlLabel, Checkbox, Select, MenuItem } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';


function ClienteProyectos() {

    const { token } = useAuth();
    const { showNotification } = useNotification();
    const [proyectos, setProyectos] = useState<Proyecto[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);

    // --- ESTADO PARA CONTROLAR LA VISUALIZACIÓN DEL DETALLE ---
    const [proyectoAVer, setProyectoAVer] = useState<Proyecto | null>(null);

    // Inicializamos estados de los filtros usando el valor propulsado por el Layout
    const [busqueda, setBusqueda] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState<Proyecto['estadoProceso'] | 'TODOS'>('TODOS');
    const [filtroInicial, setFiltroInicial] = useState("TODOS")

    // Si el filtroInicial cambia desde afuera (Layout), actualizamos el estado interno
    useEffect(() => {
        if (filtroInicial === 'TODOS') {
            setBusqueda('');
            return;
        }
        const proyecto = proyectos.find(p => p.nombre === filtroInicial);
        if (proyecto) setBusqueda(proyecto.nombre);
    }, [filtroInicial]);

    useEffect(() => {
        if (!token) return;

        setCargando(true);
        listarProyectos(token)
            .then((data) => {
                setProyectos(data);
            })
            .catch((err) => {
                console.error("Error al obtener proyectos:", err);
                showNotification("No se pudieron cargar tus proyectos", "error");
            })
            .finally(() => setCargando(false));
    }, [token]);

    const handleAbrirDetalle = (proyecto: Proyecto) => {
        setProyectoAVer(proyecto);
    };

    const handleCerrarDetalle = () => {
        setProyectoAVer(null);
    };

    if (proyectoAVer) {
        return (
            <FormularioProyecto
                proyectoAEditar={proyectoAVer}
                onGuardar={() => { }} // No hace nada en modo lectura
                onCancelar={handleCerrarDetalle}
                esLecturaOnly={true} // Forzamos el modo solo lectura
            />
        );
    }

    // Filtrado por nombre proyecto
    const normalizar = (texto: string = '') =>
        texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const proyectosFiltrados = proyectos.filter(p => {
        if (estadoFiltro !== 'TODOS' && p.estadoProceso !== estadoFiltro) return false;

        // Si la barra de búsqueda está vacía, pasa el filtro
        const termino = normalizar(busqueda.trim());
        if (termino === '') return true;

        return normalizar(p.nombre).includes(termino);
    });

    return (
        <Box sx={{ width: '100%', pt: 1 }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                    mt: 1,
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    padding: '4px 16px',
                    maxWidth: 480
                }}
            >
                <TextField
                    variant="standard"
                    placeholder="Buscar proyecto o cliente"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#888', fontSize: 20 }} />
                            </InputAdornment>
                        )
                    }}
                    sx={{ flex: 1 }}
                />

                <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />

                <Select
                    variant="standard"
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value as Proyecto['estadoProceso'] | 'TODOS')}
                    sx={{
                        fontSize: '1rem',
                        fontWeight: 500,
                        minWidth: 130,
                        '&:before': { borderBottom: 'none' },
                        '&:after': { borderBottom: 'none' }
                    }}
                >
                    <MenuItem value="TODOS">Todos los proyectos</MenuItem>
                    <MenuItem value="EN_CURSO">En curso</MenuItem>
                    <MenuItem value="COMPLETADO">Completados</MenuItem>
                    <MenuItem value="CANCELADOS">Cancelados</MenuItem>
                </Select>
            </Box>

            <TableContainer
                sx={{
                    maxHeight: 400,
                    minHeight: 350,
                    '&::-webkit-scrollbar': { width: '10px', height: '10px' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px' },
                    '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
                    '&::-webkit-scrollbar-button': { display: 'none' }
                }}
            >
                {/* 👇 Usamos proyectosFiltrados en lugar de proyectos */}
                {proyectosFiltrados.length > 0 ? (
                    proyectosFiltrados.map((p) => (
                        <Box key={p.id} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ flex: 1 }}>
                                <CardProyecto
                                    p={p}
                                    acciones={() => (
                                        <IconButton
                                            size="small"
                                            sx={{ color: '#424242' }}
                                            onClick={() => handleAbrirDetalle(p)}
                                            title="Ver detalles"
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    )}
                                />
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Typography sx={{ textAlign: 'center', color: '#666', marginTop: '60px' }}>
                        {cargando
                            ? "Cargando tus proyectos..."
                            : busqueda || estadoFiltro !== 'TODOS'
                                ? "No se encontraron proyectos con los filtros aplicados."
                                : "Actualmente no tenés proyectos asignados."
                        }
                    </Typography>
                )}
            </TableContainer>
        </Box>
    );
}

export default ClienteProyectos;