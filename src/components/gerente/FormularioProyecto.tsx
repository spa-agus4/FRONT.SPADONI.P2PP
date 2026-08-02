import { useState, useEffect } from "react"
import type { Proyecto, Cliente, Desarrollador, ProyectoDatosDTO, EstadoProyecto, EstadoProceso } from "../../types"
import { useAuth } from '../../context/AuthContext'
import { actualizarProyecto, crearProyecto, eliminarProyecto } from '../../services/proyectoService'
import { listarClientes } from '../../services/datosClienteService'
import { asignarDesarrolladoresAProyecto, listarDesarrolladores, listarDesarrolladoresPorProyecto } from '../../services/desarrolladorService'

import { TextField, Typography, Divider, Box, Alert, MenuItem, Select, FormControl, Autocomplete, Chip, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'

import { useNotification } from '../../context/NotificationContext';
import { traducirError } from '../../utils/errorManager';

import FormularioCliente from './FormularioCliente';
import ModalConfirmacion from "../shared/ModalConfirmacion"
import CampoTexto from "../shared/CampoTexto"

interface Props {
    proyectoAEditar?: Proyecto | null;
    onGuardar: (proyecto: Proyecto) => void;
    onCancelar: () => void;
    onEliminar?: (id: number) => void;
    esLecturaOnly?: boolean; // Permite alternar entre modo vista y modo edición
}

const ETAPAS: Record<EstadoProyecto, string> = {
    PLANIFICACION: 'Planificación', DISENO: 'Diseño', DESARROLLO: 'Desarrollo', PRUEBAS: 'Pruebas', ENTREGA: 'Entrega'
}
const ESTADOS_PROCESO: Record<EstadoProceso, { label: string; color: 'primary' | 'success' | 'error' }> = {
    EN_CURSO: { label: 'En curso', color: 'primary' },
    COMPLETADO: { label: 'Completado', color: 'success' },
    CANCELADO: { label: 'Cancelado', color: 'error' }
}

function FormularioProyecto({ proyectoAEditar, onGuardar, onCancelar, esLecturaOnly = false, onEliminar }: Props) {

    const formatearParaInput = (fecha: any) => {
        if (!fecha) return "";
        const d = new Date(fecha);
        return d.toISOString().split('T')[0];
    };

    const formatearFechaVista = (fecha: any) => {
        if (!fecha) return "Sin especificar";
        const d = new Date(fecha);
        return d.toLocaleDateString();
    };

    // --- ESTADOS DE CONTROL DE FLUJO INTERNO ---
    const [vistaInterna, setVistaInterna] = useState<'proyecto' | 'cliente'>('proyecto')

    // --- ESTADOS DE DATOS ---
    const [nombreProyecto, setNombreProyecto] = useState<string>(proyectoAEditar?.nombre || "")
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(proyectoAEditar?.cliente || null)
    const [listaClientes, setListaClientes] = useState<Cliente[]>([])

    const [devsSeleccionados, setDevsSeleccionados] = useState<Desarrollador[]>([])
    const [listaDevs, setListaDevs] = useState<Desarrollador[]>([])

    const [canalSolicitud, setCanalSolicitud] = useState<'EMAIL' | 'TELEFONO' | 'PRESENCIAL'>(proyectoAEditar?.canalSolicitud || 'EMAIL')
    const [fechaInicio, setFechaInicio] = useState<string>(formatearParaInput(proyectoAEditar?.fechaInicio))
    const [fechaFinalizacion, setFechaFinalizacion] = useState<string>(formatearParaInput(proyectoAEditar?.fechaFinalizacion))
    const [presupuesto, setPresupuesto] = useState<number>(proyectoAEditar?.presupuesto || 0)
    const [estadoProyecto, setEstadoProyecto] = useState<EstadoProyecto>(proyectoAEditar?.estadoProyecto || 'PLANIFICACION')
    const [estadoProceso, setEstadoProceso] = useState<EstadoProceso>(proyectoAEditar?.estadoProceso || 'EN_CURSO')

    const { token, id } = useAuth()
    const { showNotification } = useNotification()
    const [error, setError] = useState<string | null>(null);

    const procesarError = (err: any) => {
        console.error(err);
        const msg = traducirError(err);
        showNotification(msg, 'error');
    };

    // --- EFFECT PARA CARGAR LOS CLIENTES DEL BACKEND ---
    useEffect(() => {
        if (token && !esLecturaOnly) {
            listarClientes(token)
                .then((data) => setListaClientes(data))
                .catch((err) => {
                    console.error("Error al cargar clientes:", err);
                    showNotification("No se pudieron cargar los clientes", "error");
                });
        }
    }, [token]);

    // --- EFFECT PARA CARGAR LOS DESARROLLADORES DISPONIBLES ---
    useEffect(() => {
        if (token && !esLecturaOnly) {
            listarDesarrolladores(token)
                .then((data) => {
                    if (Array.isArray(data)) {
                        const filtrados = data.filter((dev) =>
                            dev.disponible === true ||
                            (proyectoAEditar?.id && dev.proyecto?.id === proyectoAEditar.id)
                        );
                        setListaDevs(filtrados);
                    }
                })
                .catch(err => console.error(err));
        }
    }, [token, proyectoAEditar]);

    // --- EFFECT PARA CARGAR LOS DEVS DE ESTE PROYECTO ---
    useEffect(() => {
        if (token && proyectoAEditar?.id) {
            listarDesarrolladoresPorProyecto(token, proyectoAEditar.id)
                .then((devsDelProyecto) => {
                    setDevsSeleccionados(devsDelProyecto);
                })
                .catch((err) => {
                    console.error("Error al cargar devs del proyecto:", err);
                });
        }
    }, [token, proyectoAEditar]);

    // Inyecta el cliente creado en la lista, lo selecciona y vuelve a la vista del proyecto
    const handleClienteCreadoExitosamente = (nuevoCliente: Cliente) => {
        setListaClientes((prev) => [...prev, nuevoCliente]);
        setClienteSeleccionado(nuevoCliente);
        setVistaInterna('proyecto');
        showNotification("¡Cliente creado y seleccionado correctamente!", "success");
    };

    const handleGuardar = () => {
        if (esLecturaOnly) return;

        setError(null);
        const errores: string[] = [];

        if (nombreProyecto.trim().length < 3) {
            errores.push("El nombre del proyecto debe tener al menos 3 caracteres.");
        }
        if (!clienteSeleccionado) {
            errores.push("El cliente es obligatorio.");
        }
        if (presupuesto < 0) {
            errores.push("El presupuesto no puede ser negativo.");
        }
        if (fechaInicio && fechaFinalizacion && new Date(fechaInicio) > new Date(fechaFinalizacion)) {
            errores.push("La fecha de inicio no puede ser posterior a la de finalización.");
        }

        if (errores.length > 0) {
            setError(errores.join(" | "));
            return;
        }

        if (!token || !id) return;

        const datosProyecto: ProyectoDatosDTO = {
            nombre: nombreProyecto,
            clienteId: clienteSeleccionado!.id,
            canalSolicitud: canalSolicitud,
            fechaInicio: fechaInicio || null,
            fechaFinalizacion: fechaFinalizacion || null,
            presupuesto: presupuesto,
            estadoProyecto: estadoProyecto,
            estadoProceso: estadoProceso
        };

        const idsDevsAAsignar = estadoProceso === 'EN_CURSO' ? devsSeleccionados.map(d => d.id) : [];

        if (proyectoAEditar?.id) {
            actualizarProyecto(token, proyectoAEditar.id, datosProyecto)
                .then((proyectoActualizado) => {
                    return asignarDesarrolladoresAProyecto(token, proyectoActualizado.id, idsDevsAAsignar)
                        .then(() => proyectoActualizado);
                })
                .then((proyectoActualizado) => {
                    onGuardar(proyectoActualizado);
                    showNotification("¡Proyecto y desarrolladores actualizados!", 'success');
                })
                .catch(procesarError);
        } else {
            crearProyecto(token, datosProyecto)
                .then((proyectoCreado) => {
                    return asignarDesarrolladoresAProyecto(token, proyectoCreado.id, idsDevsAAsignar)
                        .then(() => proyectoCreado);
                })
                .then((proyectoCreado) => {
                    onGuardar(proyectoCreado);
                    showNotification("¡Proyecto creado y desarrolladores asignados!", 'success');
                })
                .catch(procesarError);
        }
    };

    const [confirmarEliminarOpen, setConfirmarEliminarOpen] = useState(false);

    const handleEliminar = () => {
        if (!token || !proyectoAEditar?.id) return;
        eliminarProyecto(token, proyectoAEditar.id)
            .then(() => {
                showNotification("Proyecto eliminado con éxito", "success");
                setConfirmarEliminarOpen(false);
                onEliminar?.(proyectoAEditar.id);
            })
            .catch(procesarError);
    };

    // --- FILTRADO EN MEMORIA --- (filtro de devs por nombre o habilidad)
    const normalizar = (texto: string) =>
        texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const filtrarDevs = (opciones: Desarrollador[], { inputValue }: { inputValue: string }) => {
        const termino = normalizar(inputValue.trim());
        if (termino === '') return opciones;
        return opciones.filter(dev =>
            normalizar(dev.nombre).includes(termino) ||
            normalizar(dev.habilidades ?? '').includes(termino)
        );
    };


    return (
        <Box sx={{ width: '100%', minHeight: 440, position: 'relative' }}>

            {esLecturaOnly && (
                <Box
                    onClick={onCancelar}
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', color: '#555', width: 'fit-content', '&:hover': { color: '#000' } }}
                >
                    <ArrowBackIcon sx={{ fontSize: '1.1rem' }} />
                    <Typography sx={{ fontSize: '0.95rem', fontWeight: 500 }}>Volver</Typography>
                </Box>
            )}

            {/* ==========================================
                VISTA A: FORMULARIO PROYECTO 
                ========================================== */}
            <Box sx={{
                display: vistaInterna === 'proyecto' ? 'flex' : 'none',
                flexDirection: 'column',
                gap: 3
            }}>
                {error && (
                    <Alert severity="error" sx={{ border: '1px solid #d32f2f' }}>
                        {error}
                    </Alert>
                )}

                {/* --- PRIMERA FILA --- */}
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                        {esLecturaOnly ? (
                            <Typography variant="h6" sx={{ fontWeight: '600', color: '#333' }}>
                                {nombreProyecto || "SIN NOMBRE"}
                            </Typography>
                        ) : (
                            <CampoTexto
                                variant="standard"
                                placeholder="NOMBRE DEL PROYECTO"
                                value={nombreProyecto}
                                onChange={(e) => setNombreProyecto(e.target.value)}
                                sx={{ width: '220px' }}
                                maxLength={100}
                            />
                        )}

                        <Typography sx={{ color: '#555', fontWeight: '500' }}> de </Typography>

                        {esLecturaOnly ? (
                            <Typography variant="h6" sx={{ fontWeight: '500', color: '#1976d2' }}>
                                {clienteSeleccionado?.nombre || "Sin cliente"}
                            </Typography>
                        ) : (
                            <Autocomplete
                                options={[
                                    ...listaClientes.filter(c => c.activo !== false || c.id === clienteSeleccionado?.id),
                                    { id: -1, nombre: "+ Nuevo Cliente" } as any
                                ]}
                                getOptionLabel={(option) => option.nombre || ""}
                                value={clienteSeleccionado}
                                onChange={(event, newValue) => {
                                    if (newValue?.id === -1) {
                                        setVistaInterna('cliente');
                                    } else {
                                        setClienteSeleccionado(newValue);
                                    }
                                }}
                                renderInput={(params) => (
                                    <CampoTexto {...params} variant="standard" placeholder="CLIENTE" sx={{ width: '200px' }} maxLength={80} />
                                )}
                                filterOptions={(options, state) => {
                                    const query = state.inputValue.toLowerCase();
                                    return options.filter(option =>
                                        option.nombre.toLowerCase().includes(query) || option.id === -1
                                    );
                                }}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                            />
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Divider orientation="vertical" variant="middle" flexItem />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {esLecturaOnly ? "Detalles del Proyecto" : (proyectoAEditar ? "Editar Proyecto" : "Nuevo Proyecto")}
                        </Typography>
                        {!esLecturaOnly && proyectoAEditar && (
                            <IconButton
                                size="small"
                                sx={{ color: '#999', '&:hover': { color: '#d32f2f', backgroundColor: 'rgba(211, 47, 47, 0.08)' } }}
                                onClick={() => setConfirmarEliminarOpen(true)}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                </Box>

                {/* Inputs de Fechas */}
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontWeight: '500' }}>FECHA INICIO:</Typography>
                    {esLecturaOnly ? (
                        <Typography sx={{ color: '#333' }}>{formatearFechaVista(fechaInicio)}</Typography>
                    ) : (
                        <TextField variant="standard" type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} InputLabelProps={{ shrink: true }} />
                    )}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }} >
                    <Typography sx={{ fontWeight: '500' }}>FECHA FINALIZACIÓN:</Typography>
                    {esLecturaOnly ? (
                        <Typography sx={{ color: '#333' }}>{formatearFechaVista(fechaFinalizacion)}</Typography>
                    ) : (
                        <TextField variant="standard" type="date" value={fechaFinalizacion} onChange={(e) => setFechaFinalizacion(e.target.value)} InputLabelProps={{ shrink: true }} />
                    )}
                </Box>

                {/* Grid o Cuerpo de Devs e Inputs del Costado */}
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                    {/* Columna Izquierda Devs */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', alignSelf: 'flex-start', gap: 1.5, width: '80%' }}>
                            <Typography sx={{ fontWeight: '500' }}>DESARROLLADORES:</Typography>

                            {!esLecturaOnly && (
                                <Autocomplete
                                    multiple
                                    disableCloseOnSelect
                                    blurOnSelect={false}
                                    options={listaDevs}
                                    filterOptions={filtrarDevs}
                                    getOptionLabel={(option) => option.nombre || ""}
                                    value={devsSeleccionados}
                                    onChange={(event, newValue) => setDevsSeleccionados(newValue)}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderTags={() => null}
                                    renderOption={(props, option) => {
                                        const { key, ...optionProps } = props as any;
                                        return (
                                            <Box key={key} component="li" {...optionProps} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 0.5 }}>
                                                <Typography variant="body1" sx={{ fontWeight: '500' }}>{option.nombre}</Typography>
                                                {option.habilidades && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {Array.isArray(option.habilidades) ? option.habilidades.join(', ') : option.habilidades}
                                                    </Typography>
                                                )}
                                            </Box>
                                        );
                                    }}
                                    renderInput={(params) => <TextField {...params} variant="standard" placeholder="SELECCIONAR DEVS..." />}
                                    sx={{ width: '100%', maxWidth: 450 }}
                                />
                            )}

                            {devsSeleccionados.length > 0 ? (
                                <Box sx={{
                                    width: '100%', maxWidth: 450, maxHeight: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1, padding: '4px 2px',
                                    '&::-webkit-scrollbar': { width: '5px' },
                                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '4px' }
                                }}>
                                    {devsSeleccionados.map((dev) => (
                                        <Box key={dev.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '6px 10px' }}>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: '500', color: '#333' }}>{dev.nombre}</Typography>
                                                <Typography variant="caption" color="text.secondary">{dev.habilidades}</Typography>
                                            </Box>
                                            {!esLecturaOnly && (
                                                <Typography onClick={() => setDevsSeleccionados(devsSeleccionados.filter(d => d.id !== dev.id))} sx={{ cursor: 'pointer', color: '#999', fontWeight: 'bold', fontSize: '14px', '&:hover': { color: '#d32f2f' }, px: 1 }}>✕</Typography>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                esLecturaOnly && <Typography variant="body2" color="text.secondary">Sin desarrolladores asignados</Typography>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', alignSelf: 'flex-start', alignItems: 'center', gap: 1 }}>
                            {esLecturaOnly ? (
                                <Chip label={ESTADOS_PROCESO[estadoProceso].label} color={ESTADOS_PROCESO[estadoProceso].color} variant="outlined" size="small" />
                            ) : (
                                <FormControl sx={{ minWidth: 150 }}>
                                    <Select variant="standard" value={estadoProceso} onChange={(e) => setEstadoProceso(e.target.value as EstadoProceso)}>
                                        <MenuItem value="EN_CURSO">En curso</MenuItem>
                                        <MenuItem value="COMPLETADO">Completado</MenuItem>
                                        <MenuItem value="CANCELADO">Cancelado</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        </Box>
                    </Box>

                    {/* Columna Derecha Metadatos */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }} >
                            <Typography sx={{ fontWeight: '500' }}>CANAL SOLICITUD:</Typography>
                            {esLecturaOnly ? (
                                <Typography sx={{ color: '#333' }}>{canalSolicitud || "Sin especificar"}</Typography>
                            ) : (
                                <FormControl sx={{ maxWidth: 500, minWidth: 120 }}>
                                    <Select variant="standard" value={canalSolicitud} onChange={(e) => setCanalSolicitud(e.target.value as any)}>
                                        <MenuItem value="EMAIL">Email</MenuItem>
                                        <MenuItem value="TELEFONO">Teléfono</MenuItem>
                                        <MenuItem value="PRESENCIAL">Presencial</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }} >
                            <Typography sx={{ fontWeight: '500' }}>PRESUPUESTO:</Typography>
                            {esLecturaOnly ? (
                                <Typography sx={{ color: '#333' }}>
                                    {presupuesto ? `$${presupuesto.toLocaleString()}` : "$0"}
                                </Typography>
                            ) : (
                                <TextField variant="standard" type="number" value={presupuesto === 0 ? "" : presupuesto} onChange={(e) => setPresupuesto(Number(e.target.value))} />
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                            <Typography sx={{ fontWeight: '500' }}>ETAPA:</Typography>
                            {esLecturaOnly ? (
                                <Typography sx={{ color: '#333' }}>{ETAPAS[estadoProyecto]}</Typography>
                            ) : (
                                <FormControl sx={{ minWidth: 180 }}>
                                    <Select variant="standard" value={estadoProyecto} onChange={(e) => setEstadoProyecto(e.target.value as EstadoProyecto)}>
                                        {Object.entries(ETAPAS).map(([valor, label]) => (
                                            <MenuItem key={valor} value={valor}>{label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* BOTONES ACCIONES PRINCIPALES */}
                {!esLecturaOnly && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 1, width: '100%' }}>
                        <Typography onClick={onCancelar} sx={{ color: '#2e2c2c', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                            Cancelar
                        </Typography>
                        <Divider orientation="vertical" variant="middle" flexItem />
                        <Typography onClick={handleGuardar} sx={{ color: 'blue', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                            Guardar
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* ==========================================
                VISTA B: REUTILIZACIÓN DE FORMULARIO CLIENTE 
                ========================================== */}
            {vistaInterna === 'cliente' && !esLecturaOnly && (
                <FormularioCliente
                    clienteAEditar={null}
                    onCancelar={() => setVistaInterna('proyecto')}
                    onGuardar={handleClienteCreadoExitosamente}
                />
            )}

            {proyectoAEditar && (
                <ModalConfirmacion
                    open={confirmarEliminarOpen}
                    onClose={() => setConfirmarEliminarOpen(false)}
                    titulo="Confirmar eliminación"
                    mensaje={<>¿Estás seguro de que deseás eliminar el proyecto <strong>{proyectoAEditar.nombre}</strong>?</>}
                    onConfirmar={handleEliminar}
                    textoConfirmar="Eliminar"
                    colorConfirmar="red"
                />
            )}

        </Box>
    )
}

export default FormularioProyecto;