
import React from 'react'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import type { Usuario, Cliente, CredencialesDTO } from '../../types'
import { listarUsuarios, actualizarUsuario, eliminarUsuario, habilitarUsuario } from '../../services/usuarioService'

// Importamos los componentes necesarios de MUI
import {
    Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, Divider, MenuItem, Select,
    TableContainer, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box,
    Alert, Tooltip, FormControlLabel, Checkbox,
    InputAdornment
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import LockOpenIcon from '@mui/icons-material/LockOpen';

import FormularioUsuario from './FormularioUsuario'
import { useNotification } from '../../context/NotificationContext'
import { traducirError } from '../../utils/errorManager'
import CampoTexto from '../shared/CampoTexto'


function AdminUsuarios() {
    const { token, id, iniciarSesion } = useAuth()
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [open, setOpen] = useState(false)
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null)
    const [editandoId, setEditandoId] = useState<number | null>(null)
    const [nuevaContrasena, setNuevaContrasena] = useState('')
    const [nuevoNombreUsuario, setNuevoNombreUsuario] = useState('')
    const [nuevoRol, setNuevoRol] = useState<Usuario['rol'] | 'CLIENTE'>('CLIENTE')
    const [vista, setVista] = useState<'lista' | 'crear'>('lista');
    const [mostrarInhabilitados, setMostrarInhabilitados] = useState(false)
    const { showNotification } = useNotification();
    const [error, setError] = useState<string | null>(null);

    const procesarError = (err: any) => {
        console.error(err);
        const msg = traducirError(err);
        showNotification(msg, 'error');
    };

    useEffect(() => {
        if (!token) return
        listarUsuarios(token).then(data => setUsuarios(data))
    }, [token])

    const handleGuardar = () => {

        setError(null); // Limpiamos errores previos
        const errores: string[] = [];

        // 1. Verificación de seguridad (Guarda)
        if (!token || editandoId === null) return;

        // 2. Buscamos el usuario en la lista local para no perder datos
        const original = usuarios.find(u => u.id === editandoId);
        if (!original) return;

        const sinCredenciales = original.rol === 'CLIENTE' && !original.nombreUsuario;

        // 3. Preparamos los datos a enviar (usando Partial<Usuario>)
        const datosParaEnviar: CredencialesDTO = { nombreUsuario: nuevoNombreUsuario };
        if (nuevaContrasena.trim() !== '') {
            datosParaEnviar.contrasena = nuevaContrasena;
        }


        // Validar Nombre de Usuario
        if (sinCredenciales && nuevaContrasena.trim() === '') {
            errores.push("Hace falta una contraseña para activar la cuenta.");
        }
        if (nuevoNombreUsuario.trim().length < 3) {
            errores.push("El nombre de usuario debe tener al menos 3 caracteres.");
        }
        if (nuevoNombreUsuario.includes(" ")) {
            errores.push("El nombre de usuario no puede contener espacios.");
        }

        if (nuevaContrasena.trim() !== "") {
            if (nuevaContrasena.length < 4) {
                console.log("La contraseña debe tener al menos 4 caracteres.")
                errores.push("La contraseña debe tener al menos 4 caracteres.");
            } else {
                datosParaEnviar.contrasena = nuevaContrasena;
            }
        }

        // Verificar si hay errores
        if (errores.length > 0) {
            setError(errores.join(" | ")); // Los unimos con una barrita para que no ocupe tanto espacio
            return; // BLOQUEAMOS la ejecución
        }

        // validamos si cambiamos algun dato:
        if (original) {
            const huboCambioNombre = nuevoNombreUsuario !== original.nombreUsuario;
            //console.log("Si hay usuario");

            if (!huboCambioNombre && nuevaContrasena === "") {
                // Si no hubo cambios en el usuario ni contraseña, le avisamos al usuario
                showNotification("No se detectaron cambios para actualizar.", "warning");
                return;
            }
        }

        actualizarUsuario(token, editandoId, datosParaEnviar)
            .then((usuarioActualizado) => {
                // Actualizamos la tabla visualmente con la respuesta del servidor
                actualizarUsuarioEditado(usuarioActualizado.usuario)

                if (id === editandoId && usuarioActualizado.token) {    // Acá entra si el admin puso para editar su propio perfil
                    iniciarSesion(usuarioActualizado.token);
                    showNotification("¡Perfil actualizado con éxito!", 'success')
                } else {
                    showNotification("¡Usuario actualizado con éxito!", 'success')
                }
            })
            .catch(procesarError);
    };

    // Acción para Habilitar / Reactivar usuario
    const handleHabilitar = (u: Usuario) => {
        if (!token) return

        // Le pasamos activo: true Y ADEMÁS su rol original
        habilitarUsuario(token, u.id)
            .then((res) => {
                setUsuarios(prev => prev.map(item => item.id === u.id ? { ...item, activo: true } : item))
                showNotification(`Usuario ${u.nombreUsuario} habilitado con éxito`, 'success')
            })
            .catch(procesarError)
    }


    // Función que realmente hace el borrado / inhabilitación
    const confirmarEliminar = () => {
        if (token && usuarioSeleccionado) {
            eliminarUsuario(token, usuarioSeleccionado.id)
                .then((res) => {
                    // res es la respuesta del backend
                    // Si el backend devuelve el usuario y su propiedad 'activo' cambió a false:
                    if (res && res.activo === false) {
                        // NO lo eliminamos de la lista, solo actualizamos su campo 'activo' en el estado
                        setUsuarios(prev => prev.map(u =>
                            u.id === usuarioSeleccionado.id ? { ...u, activo: false } : u
                        ));
                        showNotification("El cliente tiene proyectos asociados, fue inhabilitado.", 'warning');
                    } else {
                        // Si devolvió null (o un status sin cuerpo), significa que se borró físicamente
                        setUsuarios(prev => prev.filter(user => user.id !== usuarioSeleccionado.id));
                        showNotification("¡Usuario eliminado con éxito!", 'success');
                    }

                    setOpen(false); // Cerramos el modal
                    setUsuarioSeleccionado(null);
                })
                .catch(procesarError);
        }
    };

    // Función que solo abre el modal y "setea" al usuario que elegimos
    const handleAbrirConfirmacion = (u: Usuario) => {
        setUsuarioSeleccionado(u);
        setOpen(true);
    };

    const actualizarLista = (usuarioCreado: Usuario) => {
        setVista('lista');
        setUsuarios([...usuarios, usuarioCreado]);
    };

    const actualizarUsuarioEditado = (usuarioActualizado: Usuario) => {
        setUsuarios(prev => prev.map(u =>
            u.id === editandoId ? usuarioActualizado : u
        ));

        // Limpiamos todo para salir del modo edición
        setEditandoId(null);
        setNuevaContrasena('');
        setNuevoNombreUsuario('');
        setNuevoRol('CLIENTE');
        setError(null);
    };

    const handleClose = () => {
        setEditandoId(null);
        setError(null);
    }

    // Barra de busqueda y filtros
    const [busqueda, setBusqueda] = useState('');
    const [rolFiltro, setRolFiltro] = useState<Usuario['rol'] | 'TODOS'>('TODOS');

    const normalizar = (texto: string) =>
        texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const usuariosVisibles = usuarios.filter(u => {
        if (!mostrarInhabilitados && u.activo === false) return false;
        if (rolFiltro !== 'TODOS' && u.rol !== rolFiltro) return false;

        const termino = normalizar(busqueda.trim());
        if (termino === '') return true;

        const coincideUsuario = normalizar(u.nombreUsuario ?? '').includes(termino);
        const coincideNombre = u.rol === 'CLIENTE' && normalizar((u as Cliente).nombre).includes(termino);

        return coincideUsuario || coincideNombre;
    });

    return (
        <Box>
            {vista === 'lista' ? (
                <>
                    <TableContainer
                        sx={{
                            maxHeight: 440,
                            minHeight: 440,
                            marginTop: 2,
                            '&::-webkit-scrollbar': { width: '10px', height: '10px' },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px' },
                            '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
                            '&::-webkit-scrollbar-button': { display: 'none' }
                        }}
                    >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {['ID', 'ROL', 'USUARIO', 'CONTRASEÑA', 'ACCIONES'].map((head) => (
                                        <TableCell
                                            key={head}
                                            align={head === 'ACCIONES' ? 'center' : 'left'}
                                            sx={{
                                                fontWeight: 'bold',
                                                fontSize: '1.2rem',
                                                //fontFamily: 'monospace',
                                                backgroundColor: '#e0e0e0',
                                                color: 'black',
                                                borderBottom: '2px solid #808080',
                                            }}
                                        >
                                            {head}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {usuariosVisibles.map(u => {
                                    const isInactivo = u.activo === false
                                    const sinCredenciales = u.rol === 'CLIENTE' && !u.nombreUsuario
                                    return (
                                        <React.Fragment key={u.id}> {/* Usamos Fragment para agrupar las dos filas */}
                                            {/* FILA DE ERROR: Solo aparece si estamos editando este ID y hay un error */}
                                            {error && editandoId === u.id && (
                                                <TableRow>
                                                    <TableCell colSpan={5} sx={{ padding: 0, border: 'none' }}>
                                                        <Alert
                                                            severity="error"
                                                            variant="filled"
                                                            sx={{ borderRadius: 0, fontSize: '1rem', fontWeight: 'bold' }}
                                                        >
                                                            {error}
                                                        </Alert>
                                                    </TableCell>
                                                </TableRow>
                                            )}

                                            {/*<TableRow sx={{ fontSize: '1.2rem' }} key={u.id} hover>*/}
                                            <TableRow
                                                sx={{
                                                    fontSize: '1.2rem',
                                                    opacity: isInactivo ? 0.55 : 1,
                                                    backgroundColor: isInactivo ? '#f5f5f5' : 'inherit',
                                                    fontStyle: isInactivo ? 'italic' : 'normal'
                                                }}
                                                hover
                                            >

                                                <TableCell sx={{ fontSize: '1.2rem' }}>{u.id}</TableCell>
                                                <TableCell sx={{ fontSize: '1.2rem' }}>{u.rol}</TableCell>

                                                <TableCell sx={{ fontSize: '1.2rem' }}>
                                                    {editandoId === u.id
                                                        ? <CampoTexto value={nuevoNombreUsuario} variant="outlined" onChange={e => setNuevoNombreUsuario(e.target.value)} size="small" maxLength={30} />
                                                        : u.nombreUsuario
                                                            ? u.nombreUsuario
                                                            : sinCredenciales
                                                                ? `${(u as Cliente).nombre} (sin credenciales)`
                                                                : '—'
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {editandoId === u.id
                                                        ? <CampoTexto variant="outlined" value={nuevaContrasena} onChange={e => setNuevaContrasena(e.target.value)} size="small" maxLength={50} />
                                                        : u.nombreUsuario ? '••••••••' : '—'
                                                    }
                                                </TableCell>
                                                <TableCell align="center">
                                                    {editandoId === u.id ? (
                                                        <>
                                                            <IconButton sx={{ color: '#424242' }} onClick={handleGuardar}> <CheckIcon /> </IconButton>
                                                            <IconButton sx={{ color: '#424242' }} onClick={handleClose}> <CloseIcon /> </IconButton>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {(!isInactivo || sinCredenciales) && (
                                                                <Tooltip title={sinCredenciales ? "Asignar credenciales" : "Editar"}>
                                                                    <IconButton
                                                                        sx={{ color: '#424242' }}
                                                                        onClick={() => {
                                                                            setEditandoId(u.id)
                                                                            setNuevoRol(u.rol)
                                                                            setNuevoNombreUsuario(u.nombreUsuario ?? '')
                                                                            setNuevaContrasena('')
                                                                            setError(null)
                                                                        }}
                                                                    >
                                                                        <EditIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}

                                                            {isInactivo && !sinCredenciales && (
                                                                <Tooltip title="Habilitar usuario">
                                                                    <IconButton sx={{ color: '#2e7d32' }} onClick={() => handleHabilitar(u)}>
                                                                        <LockOpenIcon fontSize="large" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}

                                                            {!isInactivo && u.id !== id && (
                                                                <IconButton onClick={() => handleAbrirConfirmacion(u)}>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            )}
                                                        </>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    )
                                })}
                            </TableBody>
                        </Table>
                        {/* Modal de Confirmación */}
                        <Dialog
                            open={open}
                            onClose={() => setOpen(false)}
                            PaperProps={{
                                sx: {
                                    border: '3px solid black',
                                    borderRadius: 2,
                                    backgroundColor: '#e0e0e0',
                                }
                            }}
                        >
                            <DialogTitle sx={{ backgroundColor: 'black', color: 'white', py: 1, fontSize: '1rem' }}>
                                Confirmar eliminación
                            </DialogTitle>
                            <DialogContent sx={{ mt: 2 }}>
                                ¿Estás seguro de que deseás eliminar al usuario
                                <strong> {usuarioSeleccionado?.nombreUsuario} </strong>
                                con el rol <strong> {usuarioSeleccionado?.rol}</strong>?
                            </DialogContent>
                            <DialogActions sx={{ p: 2 }}>

                                <Typography
                                    onClick={() => setOpen(false)}
                                    sx={{
                                        fontSize: 20,
                                        color: '#2e2c2c',
                                        cursor: 'pointer',
                                        '&:hover': { textDecoration: 'underline' }
                                    }}
                                >
                                    Cancelar
                                </Typography>
                                <Divider orientation="vertical" variant="middle" flexItem />
                                <Typography
                                    onClick={confirmarEliminar}
                                    sx={{
                                        fontSize: 20,
                                        color: 'red',
                                        cursor: 'pointer',
                                        '&:hover': { textDecoration: 'underline' }
                                    }}
                                >
                                    Eliminar
                                </Typography>
                            </DialogActions>
                        </Dialog>
                    </TableContainer>

                    {/* PIE DE TABLA: Checkbox a la izquierda, Agregar Usuario a la derecha */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mt: 2, flexWrap: 'wrap', gap: 2 }}>
                        <Box
                            sx={{
                                display: 'flex', alignItems: 'center', gap: 2,
                                backgroundColor: '#e0e0e0', border: '1px solid #acacac', borderRadius: '12px',
                                padding: '4px 16px', maxWidth: 640, flex: 1
                            }}
                        >
                            <TextField
                                variant="standard"
                                placeholder="Buscar por usuario o nombre de cliente"
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
                                        checked={mostrarInhabilitados}
                                        onChange={(e) => setMostrarInhabilitados(e.target.checked)}
                                        sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }}
                                    />
                                }
                                label={<Typography sx={{ fontSize: '1rem', fontWeight: 500, color: 'black' }}>Inhabilitados</Typography>}
                            />

                            <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />

                            <Select
                                variant="standard"
                                value={rolFiltro}
                                onChange={(e) => setRolFiltro(e.target.value as Usuario['rol'] | 'TODOS')}
                                sx={{
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    minWidth: 130,
                                    '&:before': { borderBottom: 'none' },
                                    '&:after': { borderBottom: 'none' }
                                }}
                            >
                                <MenuItem value="TODOS">Todos los roles</MenuItem>
                                <MenuItem value="CLIENTE">Cliente</MenuItem>
                                <MenuItem value="GERENTE">Gerente</MenuItem>
                                <MenuItem value="ADMINISTRADOR">Administrador</MenuItem>
                            </Select>
                        </Box>

                        <Typography
                            onClick={() => {
                                setNuevoNombreUsuario('');
                                setNuevaContrasena('');
                                setNuevoRol('CLIENTE');
                                setVista('crear');
                            }}
                            sx={{ color: 'black', fontWeight: 'bold', mt: 3, fontSize: '1.2rem', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                        >
                            Agregar Usuario...
                        </Typography>
                    </Box>
                </>

            ) : (

                <FormularioUsuario
                    usuario={null}
                    onGuardar={actualizarLista}
                    onCancelar={() => setVista('lista')}
                />

            )}
        </Box>
    );
}

export default AdminUsuarios