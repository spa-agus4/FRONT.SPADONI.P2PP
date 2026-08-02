import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

import type { Proyecto, Cliente } from '../../types';
import { listarProyectos, eliminarProyecto } from '../../services/proyectoService';
import { listarClientes } from '../../services/datosClienteService'; // <-- Traemos el servicio para poblar el filtro

import CardProyecto from '../cards/CardProyecto';
import ModalConfirmacion from '../shared/ModalConfirmacion';
import FormularioProyecto from './FormularioProyecto';
import { useNotification } from '../../context/NotificationContext';
import { traducirError } from '../../utils/errorManager';

import { TableContainer, Box, Typography, Alert, FormControl, InputLabel, Select, MenuItem, IconButton, TextField, FormControlLabel, Checkbox, InputAdornment, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search';

interface GerenteProyectosProps {
    filtroInicial?: number | 'TODOS';
}

function GerenteProyectos({ filtroInicial = 'TODOS' }: GerenteProyectosProps) {

    const { token } = useAuth();
    const { showNotification } = useNotification();
    const [proyectos, setProyectos] = useState<Proyecto[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]); // <-- Estado para los clientes del filtro

    // Inicializamos estados de los filtros usando el valor propulsado por el Layout
    const [busqueda, setBusqueda] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState<Proyecto['estadoProceso'] | 'TODOS'>('TODOS');

    const [open, setOpen] = useState<boolean>(false)
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState<Proyecto | null>(null)

    const [verFormulario, setVerFormulario] = useState<boolean>(false);
    const [proyectoAEditar, setProyectoAEditar] = useState<Proyecto | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [editandoId, setEditandoId] = useState<number | null>(null)

    const procesarError = (err: any) => {
        console.error(err);
        const msg = traducirError(err);
        showNotification(msg, 'error');
    };

    // Si el filtroInicial cambia desde afuera (Layout), actualizamos el estado interno
    useEffect(() => {
        if (filtroInicial === 'TODOS') {
            setBusqueda('');
            return;
        }
        const cliente = clientes.find(c => c.id === filtroInicial);
        if (cliente) setBusqueda(cliente.nombre);
    }, [filtroInicial, clientes]);

    // Cargar proyectos y clientes al inicio
    useEffect(() => {
        if (!token) return;

        listarProyectos(token).then(setProyectos).catch(console.error);
        listarClientes(token).then(setClientes).catch(console.error); // <-- Traemos los clientes
    }, [token]);

    // Función para abrir el formulario en modo CREACIÓN
    const handleNuevoProyecto = () => {
        setProyectoAEditar(null);
        setVerFormulario(true);
    };

    // Función para abrir el formulario en modo EDICIÓN
    const handleEditarClick = (p: Proyecto) => {
        setProyectoAEditar(p);
        setVerFormulario(true);
    };

    // Modal de eliminar
    const handleAbrirModal = (p: Proyecto) => {
        setProyectoSeleccionado(p)
        setOpen(true)
    }

    const confirmarEliminar = () => {
        if (token && proyectoSeleccionado) {
            eliminarProyecto(token, proyectoSeleccionado.id)
                .then(() => {
                    setProyectos(prev => prev.filter(p => p.id !== proyectoSeleccionado.id));
                    setOpen(false)
                    setProyectoSeleccionado(null)
                    showNotification("Proyecto eliminado con éxito", "success");
                }).catch(procesarError);
        }
    }

    const handleGuardarFormulario = (proyectoProcesado: Proyecto) => {
        if (proyectoAEditar) {
            setProyectos(prev => prev.map(p => p.id === proyectoProcesado.id ? proyectoProcesado : p));
        } else {
            setProyectos(prev => [...prev, proyectoProcesado]);
        }
        setVerFormulario(false);
        setProyectoAEditar(null);
    };

    // --- FILTRADO EN MEMORIA --- (filtro de proyecto o cliente)
    const normalizar = (texto: string) =>
        texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const proyectosFiltrados = proyectos.filter(p => {
        if (estadoFiltro !== 'TODOS' && p.estadoProceso !== estadoFiltro) return false;

        const termino = normalizar(busqueda.trim());
        if (termino === '') return true;

        return normalizar(p.nombre).includes(termino)
            || normalizar(p.cliente?.nombre ?? '').includes(termino);
    });

    if (verFormulario) {
        return (
            <FormularioProyecto
                proyectoAEditar={proyectoAEditar}
                onGuardar={handleGuardarFormulario}
                onCancelar={() => { setVerFormulario(false); setProyectoAEditar(null); }}
                onEliminar={(id) => {
                    setProyectos(prev => prev.filter(p => p.id !== id));
                    setVerFormulario(false);
                    setProyectoAEditar(null);
                }}
            />
        );
    }

    return (
        <Box>
            {/* CONTENEDOR DEL FILTRO */}
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
                    maxWidth: 580
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
                    maxHeight: 370,
                    minHeight: 370,
                    marginTop: 1,
                    '&::-webkit-scrollbar': { width: '10px', height: '10px' },
                    '&::-webkit-scrollbar-track': {},
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px' },
                    '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
                    '&::-webkit-scrollbar-button': { display: 'none' }
                }}
            >
                {proyectosFiltrados.length > 0 ? (
                    proyectosFiltrados.map((p) => (
                        <Box key={p.id} sx={{ mb: 2 }}>
                            {error && editandoId === p.id && (
                                <Alert severity="error" sx={{ mb: 1, border: '1px solid #d32f2f', borderRadius: '5px' }}>
                                    {error}
                                </Alert>
                            )}

                            <CardProyecto
                                p={p}
                                acciones={(proyectoActualizado) => (
                                    <>
                                        {/* Botón Ver / Detalle */}
                                        <IconButton
                                            size="small"
                                            sx={{ color: '#424242' }}
                                            onClick={() => handleEditarClick(p)}
                                            title="Ver detalles"
                                        >
                                            <EditIcon />
                                        </IconButton>

                                        {/* Botón Eliminar */}
                                        <IconButton
                                            size="small"
                                            sx={{ color: '#424242' }}
                                            onClick={() => handleAbrirModal(p)}
                                            title="Eliminar proyecto"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                )}
                            />
                        </Box>
                    ))
                ) : (
                    <Typography sx={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
                        No hay proyectos cargados para el criterio seleccionado.
                    </Typography>
                )}

                {open && (
                    <ModalConfirmacion
                        open={open}
                        onClose={() => setOpen(false)}
                        titulo="Confirmar eliminación"
                        mensaje={<>¿Estás seguro de que deseás eliminar el proyecto <strong>{proyectoSeleccionado?.nombre}</strong>?</>}
                        onConfirmar={confirmarEliminar}
                        textoConfirmar="Eliminar"
                        colorConfirmar="red"
                    />
                )}
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Typography
                    onClick={handleNuevoProyecto}
                    sx={{
                        color: 'black',
                        fontWeight: 'bold',
                        mt: 3,
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    Agregar Proyecto...
                </Typography>
            </Box>
        </Box>
    );
}

export default GerenteProyectos;