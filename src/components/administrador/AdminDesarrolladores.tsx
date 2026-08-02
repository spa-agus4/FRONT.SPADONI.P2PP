import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

import type { Desarrollador, DesarrolladorEdicionDTO } from '../../types'
import { listarDesarrolladores, eliminarDesarrollador, actualizarDesarrollador } from '../../services/desarrolladorService'

import CardDesarrollador from '../cards/CardDesarrollador';
import ModalConfirmacion from '../shared/ModalConfirmacion';

import { TableContainer, IconButton, Box, Typography, Alert, Divider, Select, TextField, InputAdornment, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import FormularioDesarrollador from './FormularioDesarrollador';
import { useNotification } from '../../context/NotificationContext';
import { traducirError } from '../../utils/errorManager';

function AdminDesarrolladores() {

    const { token } = useAuth();
    const [desarrolladores, setDesarrolladores] = useState<Desarrollador[]>([])
    const [editandoId, setEditandoId] = useState<number | null>(null)
    const [open, setOpen] = useState<boolean>(false)
    const [devSeleccionado, setDevSeleccionado] = useState<Desarrollador | null>(null)
    const [vista, setVista] = useState<'lista' | 'crear'>('lista');
    const { showNotification } = useNotification();
    const [error, setError] = useState<string | null>(null);

    const procesarError = (err: any) => {
        console.error(err);
        const msg = traducirError(err);
        showNotification(msg, 'error');
        //setError(msg);
    };

    useEffect(() => {
        if (!token) return;
        listarDesarrolladores(token).then(setDesarrolladores)   // IGUAL A: listarDesarrolladores(token).then(response => setDesarrolladores(response))
    }, [token])

    const handleGuardar = (datosRecibidos: Desarrollador) => {

        setError(null); // Limpiamos errores previos
        const errores: string[] = [];

        if (!token || editandoId === null) return;

        const devOriginal = desarrolladores.find(d => d.id === editandoId);
        if (!devOriginal) return;

        const huboCambioNombre = datosRecibidos.nombre !== devOriginal!.nombre;
        const huboCambioHabilidades = datosRecibidos.habilidades !== devOriginal!.habilidades;
        const huboCambioDisponibilidad = datosRecibidos.disponible !== devOriginal!.disponible;

        if (!huboCambioNombre && !huboCambioHabilidades && !huboCambioDisponibilidad) {
            showNotification("No se detectaron cambios para actualizar.", "warning");
            return;
        }

        // Validar Nombre de Usuario
        if (datosRecibidos.nombre.trim().length < 3) {
            errores.push("El nombre de usuario debe tener al menos 3 caracteres.");
        }

        // Verificar si hay errores
        if (errores.length > 0) {
            setError(errores.join(" | "));
            return;
        }


        const datosParaEnviar: DesarrolladorEdicionDTO = {}

        if (datosRecibidos.nombre != '')
            datosParaEnviar.nombre = datosRecibidos.nombre

        if (datosRecibidos.habilidades != '')
            datosParaEnviar.habilidades = datosRecibidos.habilidades

        datosParaEnviar.disponible = datosRecibidos.disponible;

        actualizarDesarrollador(token, editandoId, datosParaEnviar)
            .then((devActualizado) => {
                setDesarrolladores(prev => prev.map(d => d.id === editandoId ? devActualizado : d));
                setEditandoId(null)

                if (!devOriginal.disponible && datosRecibidos.disponible) {
                    showNotification("Se removió al desarrollador de su proyecto", 'warning');
                } else {
                    showNotification("Desarrollador actualizado con éxito", "success");
                }
            })
            .catch(procesarError);
    }

    // Modal de eliminar
    const handleAbrirModal = (dev: Desarrollador) => {
        setDevSeleccionado(dev)
        setOpen(true)
    }

    const confirmarEliminar = () => {
        if (token && devSeleccionado) {
            eliminarDesarrollador(token, devSeleccionado.id)
                .then(() => {
                    setDesarrolladores(prev => prev.filter(dev => dev.id !== devSeleccionado.id));  // Filtramos la lista para que desaparezca de la pantalla
                    setOpen(false)
                    setDevSeleccionado(null)
                    showNotification("Desarrollador eliminado con éxito", "success");
                }).catch(procesarError);
        }
    }

    const actualizarLista = (desarrolladorCreado: Desarrollador) => {
        setVista('lista')
        setDesarrolladores([...desarrolladores, desarrolladorCreado])
    }

    const [busqueda, setBusqueda] = useState('');
    const [filtroDisponibilidad, setFiltroDisponibilidad] = useState<'TODOS' | 'DISPONIBLE' | 'OCUPADO' | 'NO DISPONIBLE'>('TODOS');

    const normalizar = (texto: string) =>
        texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const desarrolladoresVisibles = desarrolladores.filter(dev => {
        if (filtroDisponibilidad === 'DISPONIBLE' && !dev.disponible) return false;
        if (filtroDisponibilidad === 'OCUPADO' && (dev.disponible || dev.proyecto === null)) return false;
        if (filtroDisponibilidad === 'NO DISPONIBLE' && (dev.disponible || dev.proyecto !== null)) return false;

        const termino = normalizar(busqueda.trim());
        if (termino === '') return true;

        return normalizar(dev.nombre).includes(termino);
    });

    return (
        <Box>
            {vista === 'lista' ? (
                <>
                    <Box
                        sx={{
                            display: 'flex', alignItems: 'center', gap: 2, mb: 2, mt: 1,
                            backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '12px',
                            padding: '4px 16px', maxWidth: 560
                        }}
                    >
                        <TextField
                            variant="standard"
                            placeholder="Buscar desarrollador por nombre"
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
                            value={filtroDisponibilidad}
                            onChange={(e) => setFiltroDisponibilidad(e.target.value as 'TODOS' | 'DISPONIBLE' | 'OCUPADO' | 'NO DISPONIBLE')}
                            sx={{
                                fontSize: '1rem', fontWeight: 500, minWidth: 130,
                                '&:before': { borderBottom: 'none' },
                                '&:after': { borderBottom: 'none' }
                            }}
                        >
                            <MenuItem value="TODOS">Todos</MenuItem>
                            <MenuItem value="DISPONIBLE">Disponible</MenuItem>
                            <MenuItem value="OCUPADO">Ocupado</MenuItem>
                            <MenuItem value="NO DISPONIBLE">No disponible</MenuItem>
                        </Select>
                    </Box>
                    <TableContainer
                        sx={{
                            maxHeight: 440,
                            minHeight: 440,
                            marginTop: 2,
                            // Configuración del scrollbar
                            '&::-webkit-scrollbar': {
                                width: '10px', // Ancho de la barra vertical
                                height: '10px', // Alto de la barra horizontal
                            },
                            '&::-webkit-scrollbar-track': {
                                //backgroundColor: '#f1f1f1', // Color del fondo del scroll
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#888', // Color de la barra gris
                                borderRadius: '10px',    // Sin bordes redondeados
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                backgroundColor: '#555', // Color al pasar el mouse
                            },
                            // Esto elimina las flechas (buttons)
                            '&::-webkit-scrollbar-button': {
                                display: 'none',
                            }
                        }}
                    >
                        {desarrolladoresVisibles.length > 0 ? (
                            desarrolladoresVisibles.map((dev) => (
                                <Box key={dev.id} sx={{ mb: 2 }}>

                                    {error && editandoId === dev.id && (
                                        <Alert
                                            severity="error"
                                            sx={{
                                                mb: 1,
                                                border: '1px solid #d32f2f',
                                                borderRadius: '5px'
                                            }}
                                        >
                                            {error}
                                        </Alert>
                                    )}

                                    <CardDesarrollador
                                        dev={dev}
                                        editando={editandoId === dev.id}
                                        acciones={(datosDelHijo) => (
                                            <>
                                                {editandoId === dev.id ? (
                                                    <>
                                                        <IconButton sx={{ color: '#424242' }} onClick={() => handleGuardar(datosDelHijo!)}> <CheckIcon /> </IconButton>
                                                        <IconButton sx={{ color: '#424242' }}
                                                            onClick={() => {
                                                                setEditandoId(null)
                                                                setError(null)
                                                            }}> <CloseIcon /> </IconButton>
                                                    </>
                                                ) : (
                                                    <>
                                                        <IconButton sx={{ color: '#424242' }}
                                                            onClick={() => {
                                                                setEditandoId(dev.id)
                                                                setError(null)
                                                            }}> <EditIcon /> </IconButton>
                                                        <IconButton sx={{ color: '#424242' }} onClick={() => handleAbrirModal(dev)}> <DeleteIcon /> </IconButton>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    />
                                </Box>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
                                {desarrolladores.length === 0
                                    ? "No hay desarrolladores cargados actualmente."
                                    : "No se encontraron desarrolladores con ese criterio."}
                            </p>
                        )}


                        <>
                            {open &&
                                <ModalConfirmacion
                                    open={open}
                                    onClose={() => setOpen(false)}
                                    titulo="Confirmar eliminación"
                                    mensaje={<>¿Estás seguro de que deseás eliminar al desarrollador <strong>{devSeleccionado?.nombre}</strong>?</>}
                                    onConfirmar={confirmarEliminar}
                                    textoConfirmar="Eliminar"
                                    colorConfirmar="red"
                                />}
                        </>
                    </TableContainer>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <Typography
                            onClick={() => {
                                // Limpiamos los campos antes de entrar
                                //setNuevoNombreUsuario('');
                                // setNuevaContrasena('');
                                //setNuevoRol('CLIENTE');
                                setVista('crear');
                            }}
                            sx={{
                                color: 'black',
                                fontWeight: 'bold',
                                mt: 3,
                                fontSize: '1.2rem',
                                cursor: 'pointer',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            Agregar Desarrollador...
                        </Typography>
                    </Box>
                </>
            ) : (
                <FormularioDesarrollador
                    onGuardar={actualizarLista}
                    onCancelar={() => setVista('lista')}
                />
            )}
        </Box>
    )
}

export default AdminDesarrolladores