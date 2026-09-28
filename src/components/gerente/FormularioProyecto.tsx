import { useState } from "react"
import type { Proyecto, Cliente, ProyectoDatosDTO, EstadoProceso } from "../../types"
import { actualizarProyecto, crearProyecto, eliminarProyecto } from '../../services/proyectoService'
import { asignarDesarrolladoresAProyecto } from '../../services/desarrolladorService'

import { Typography, Divider, Box, Alert, MenuItem, Select, FormControl, Autocomplete, Chip, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'

import { useNotification } from '../../context/NotificationContext';

import FormularioCliente from './FormularioCliente';
import CampoTexto from "../shared/CampoTexto"
import { useProcesarError } from "../../hooks/useProcesarError"
import ModalEliminar from "../shared/Modales/ModalEliminar"
import { validarFormularioProyecto } from "../../utils/validations/validarFormularioProyecto"
import SelectorDesarrolladores from "./FormularioProyecto/SelectorDesarrolladores"
import DatosAdministrativosProyecto from "./FormularioProyecto/DatosAdministrativosProyecto"
import { SelectorFecha } from "./FormularioProyecto/SelectorFecha"
import { useFormularioProyecto } from "../../hooks/useFormularioProyecto"
import { useDatosFormularioProyecto } from "../../hooks/useDatosExtFormProyecto"

interface Props {
    proyectoAEditar?: Proyecto | null;
    onGuardar: (proyecto: Proyecto) => void;
    onCancelar: () => void;
    onEliminar?: (id: number) => void;
    esLecturaOnly?: boolean; // Permite alternar entre modo vista y modo edición
}

const ESTADOS_PROCESO: Record<EstadoProceso, { label: string; color: 'primary' | 'success' | 'error' }> = {
    EN_CURSO: { label: 'En curso', color: 'primary' },
    COMPLETADO: { label: 'Completado', color: 'success' },
    CANCELADO: { label: 'Cancelado', color: 'error' }
}

function FormularioProyecto({ proyectoAEditar, onGuardar, onCancelar, esLecturaOnly = false, onEliminar }: Props) {

    const {
        nombreProyecto,
        setNombreProyecto,
        clienteSeleccionado,
        setClienteSeleccionado,
        canalSolicitud,
        setCanalSolicitud,
        fechaInicio,
        setFechaInicio,
        fechaFinalizacion,
        setFechaFinalizacion,
        presupuesto,
        setPresupuesto,
        estadoProyecto,
        setEstadoProyecto,
        estadoProceso,
        setEstadoProceso
    } = useFormularioProyecto(proyectoAEditar);

    // --- ESTADOS DE CONTROL DE FLUJO INTERNO ---
    const [vistaInterna, setVistaInterna] = useState<'proyecto' | 'cliente'>('proyecto')

    // --- ESTADOS DE DATOS ---
    const {
        listaClientes,
        agregarCliente,
        listaDevs,
        devsSeleccionados,
        setDevsSeleccionados
    } = useDatosFormularioProyecto(proyectoAEditar, esLecturaOnly);

    const { showNotification } = useNotification()
    const [error, setError] = useState<string | null>(null);

    const { procesarError } = useProcesarError();

    // Inyecta el cliente creado en la lista, lo selecciona y vuelve a la vista del proyecto
    const handleClienteCreadoExitosamente = (nuevoCliente: Cliente) => {
        agregarCliente(nuevoCliente);
        setClienteSeleccionado(nuevoCliente);
        setVistaInterna('proyecto');
        showNotification("¡Cliente creado y seleccionado correctamente!", "success");
    };

    const handleGuardar = () => {
        if (esLecturaOnly) return;

        setError(null);
        const errores = validarFormularioProyecto(nombreProyecto, clienteSeleccionado, presupuesto, fechaInicio, fechaFinalizacion);

        if (errores.length > 0) {
            setError(errores.join(" | "));
            return;
        }

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
            actualizarProyecto(proyectoAEditar.id, datosProyecto)
                .then((proyectoActualizado) => {
                    return asignarDesarrolladoresAProyecto(proyectoActualizado.id, idsDevsAAsignar)
                        .then(() => proyectoActualizado);
                })
                .then((proyectoActualizado) => {
                    onGuardar(proyectoActualizado);
                    showNotification("¡Proyecto y desarrolladores actualizados!", 'success');
                })
                .catch(procesarError);
        } else {
            crearProyecto(datosProyecto)
                .then((proyectoCreado) => {
                    return asignarDesarrolladoresAProyecto(proyectoCreado.id, idsDevsAAsignar)
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
        if (!proyectoAEditar?.id) return;
        eliminarProyecto(proyectoAEditar.id)
            .then(() => {
                showNotification("Proyecto eliminado con éxito", "success");
                setConfirmarEliminarOpen(false);
                onEliminar?.(proyectoAEditar.id);
            })
            .catch(procesarError);
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
                                    ...listaClientes,
                                    { id: -1, nombre: "+ Nuevo Cliente" } as Cliente
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
                <SelectorFecha
                    label="FECHA INICIO"
                    value={fechaInicio}
                    onChange={setFechaInicio}
                    isReadOnly={esLecturaOnly}
                />

                <SelectorFecha
                    label="FECHA FINALIZACIÓN"
                    value={fechaFinalizacion}
                    onChange={setFechaFinalizacion}
                    isReadOnly={esLecturaOnly}
                />

                {/* Grid o Cuerpo de Devs e Inputs del Costado */}
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                    {/* Columna Izquierda Devs */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <SelectorDesarrolladores
                            desarrolladoresDisponibles={listaDevs}
                            desarrolladoresSeleccionados={devsSeleccionados}
                            onChange={setDevsSeleccionados}
                            esLecturaOnly={esLecturaOnly}
                        />

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
                    <DatosAdministrativosProyecto
                        canalSolicitud={canalSolicitud}
                        onChangeCanal={setCanalSolicitud}
                        presupuesto={presupuesto}
                        onChangePresupuesto={setPresupuesto}
                        estadoProyecto={estadoProyecto}
                        onChangeEstado={setEstadoProyecto}
                        esLecturaOnly={esLecturaOnly}
                    />
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
                <ModalEliminar
                    open={confirmarEliminarOpen}
                    onClose={() => setConfirmarEliminarOpen(false)}
                    mensaje={<>¿Estás seguro de que deseás eliminar el proyecto <strong>{proyectoAEditar.nombre}</strong>?</>}
                    onConfirmar={handleEliminar}
                />
            )}

        </Box>
    )
}

export default FormularioProyecto;