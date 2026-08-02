import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

import type { Cliente } from '../../types';
import { listarClientes, eliminarCliente, habilitarCliente } from '../../services/datosClienteService';

import CardCliente from '../cards/CardCliente';
import ModalConfirmacion from '../shared/ModalConfirmacion';
import FormularioCliente from './FormularioCliente';
import { useNotification } from '../../context/NotificationContext';
import { traducirError } from '../../utils/errorManager';

import { TableContainer, Box, Typography, Alert, FormControlLabel, Divider, Checkbox, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface GerenteClientesProps {
    onVerProyectosCliente: (id: number) => void;    // esto es para recibir el ID de un cliente (desde otra vista) y filtrar sus proyectos en esta vista
}

function GerenteClientes({ onVerProyectosCliente }: GerenteClientesProps) {

    const { token } = useAuth();
    const { showNotification } = useNotification();
    const [clientes, setClientes] = useState<Cliente[]>([]);

    const [open, setOpen] = useState<boolean>(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);

    const [verFormulario, setVerFormulario] = useState<boolean>(false);
    const [clienteAEditar, setClienteAEditar] = useState<Cliente | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [editandoId, setEditandoId] = useState<number | null>(null);

    const procesarError = (err: any) => {
        console.error(err);
        const msg = traducirError(err);
        showNotification(msg, 'error');
    };

    // Cargar clientes al inicio
    useEffect(() => {
        if (!token) return;
        listarClientes(token)
            .then(setClientes)
            .catch(console.error);
    }, [token]);

    const handleNuevoCliente = () => {
        setClienteAEditar(null);
        setVerFormulario(true);
    };

    const handleEditarClick = (c: Cliente) => {
        setClienteAEditar(c);
        setVerFormulario(true);
    };

    const handleAbrirModal = (c: Cliente) => {
        setClienteSeleccionado(c);
        setOpen(true);
    };

    const confirmarEliminar = () => {   // Inhabilitar cliente si tiene proyectos, no eliminarlo
        if (token && clienteSeleccionado) {
            eliminarCliente(token, clienteSeleccionado.id)
                .then((res) => {

                    // res es la respuesta del backend
                    // Si el backend devuelve el usuario y su propiedad 'activo' cambió a false:
                    if (res && res.activo === false) {
                        // NO lo eliminamos de la lista, solo actualizamos su campo 'activo' en el estado
                        setClientes(prev => prev.map(u =>
                            u.id === clienteSeleccionado.id ? { ...u, activo: false } : u
                        ));
                        showNotification("El cliente tiene proyectos asociados, fue inhabilitado.", 'warning');
                    } else {
                        // Si devolvió null (o un status sin cuerpo), significa que se borró físicamente
                        setClientes(prev => prev.filter(user => user.id !== clienteSeleccionado.id));
                        showNotification("Cliente eliminado con éxito!", 'success');
                    }
                    setOpen(false);
                    setClienteSeleccionado(null);
                })
                .catch(procesarError);
        }
    };

    const handleHabilitar = (c: Cliente) => {
        if (!token) return;
        habilitarCliente(token, c.id)
            .then(() => {
                setClientes(prev => prev.map(u => u.id === c.id ? { ...u, activo: true } : u));
                showNotification(`Cliente ${c.nombre} habilitado con éxito`, 'success');
            })
            .catch(procesarError);
    };

    const handleGuardarFormulario = (clienteProcesado: Cliente) => {
        if (clienteAEditar) {
            setClientes(prev => prev.map(c => c.id === clienteProcesado.id ? clienteProcesado : c));
        } else {
            setClientes(prev => [...prev, clienteProcesado]);
        }
        setVerFormulario(false);
        setClienteAEditar(null);
    };

    const [busqueda, setBusqueda] = useState('');
    const [ocultarInhabilitados, setOcultarInhabilitados] = useState(false);

    const normalizar = (texto: string) =>
        texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const clientesFiltrados = clientes.filter(c => {
        if (ocultarInhabilitados && c.activo === false) return false;

        const termino = normalizar(busqueda.trim());
        if (termino === '') return true;

        return normalizar(c.nombre).includes(termino)
            || normalizar(c.email).includes(termino);
    });

    if (verFormulario) {
        return (
            <FormularioCliente
                clienteAEditar={clienteAEditar}
                onGuardar={handleGuardarFormulario}
                onCancelar={() => {
                    setVerFormulario(false);
                    setClienteAEditar(null);
                }}
            />
        );
    }

    return (
        <Box>
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
                    placeholder="Buscar cliente por nombre o email"
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

                <FormControlLabel
                    sx={{ mr: 0, whiteSpace: 'nowrap' }}
                    control={
                        <Checkbox
                            checked={ocultarInhabilitados}
                            onChange={(e) => setOcultarInhabilitados(e.target.checked)}
                            sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }}
                        />
                    }
                    label={
                        <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: 'black' }}>
                            Ocultar inhabilitados
                        </Typography>
                    }
                />
            </Box>

            <TableContainer
                sx={{
                    maxHeight: 370,
                    minHeight: 370,
                    marginTop: 2,
                    '&::-webkit-scrollbar': { width: '10px', height: '10px' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px' },
                    '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
                    '&::-webkit-scrollbar-button': { display: 'none' }
                }}
            >
                {clientesFiltrados.length > 0 ? (
                    clientesFiltrados.map((c) => (
                        <Box key={c.id} sx={{ mb: 2 }}>
                            {error && editandoId === c.id && (
                                <Alert severity="error" sx={{ mb: 1, border: '1px solid #d32f2f', borderRadius: '5px' }}>
                                    {error}
                                </Alert>
                            )}

                            {/* ACÁ LE PASAMOS EL CALLBACK CORRECTAMENTE DENTRO DEL MAP */}
                            <CardCliente
                                c={c}
                                onEditar={handleEditarClick}
                                onEliminar={handleAbrirModal}
                                onVerProyectos={() => onVerProyectosCliente(c.id)} // <-- Vinculado al Layout
                                onHabilitar={handleHabilitar}
                            />
                        </Box>
                    ))
                ) : (
                    <Typography sx={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
                        {clientes.length === 0
                            ? "No hay clientes cargados actualmente."
                            : "No se encontraron clientes con ese criterio."}
                    </Typography>
                )}

                {open && (  //Para eliminar cliente
                    <ModalConfirmacion
                        open={open}
                        onClose={() => setOpen(false)}
                        titulo="Confirmar eliminación"
                        mensaje={<>¿Estás seguro de que deseás eliminar al cliente <strong>{clienteSeleccionado?.nombre}</strong>?</>}
                        onConfirmar={confirmarEliminar}
                        textoConfirmar="Eliminar"
                        colorConfirmar="red"
                    />
                )}
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Typography
                    onClick={handleNuevoCliente}
                    sx={{
                        color: 'black',
                        fontWeight: 'bold',
                        mt: 3,
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    Agregar Cliente...
                </Typography>
            </Box>
        </Box>
    );
}

export default GerenteClientes;