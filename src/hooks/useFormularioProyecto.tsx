import { useEffect, useState } from 'react';
import type {
    Proyecto,
    Cliente,
    EstadoProyecto,
    EstadoProceso,
    ProyectoDatosDTO
} from '../types';
import { formatearFechaInput } from '../utils/dateUtils';

export function useFormularioProyecto(proyectoAEditar?: Proyecto | null) {

    const [nombreProyecto, setNombreProyecto] = useState(
        proyectoAEditar?.nombre || ''
    );

    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(
        proyectoAEditar?.cliente || null
    );

    const [canalSolicitud, setCanalSolicitud] = useState<
        ProyectoDatosDTO['canalSolicitud']
    >(
        proyectoAEditar?.canalSolicitud || 'EMAIL'
    );

    const [fechaInicio, setFechaInicio] = useState(
        formatearFechaInput(proyectoAEditar?.fechaInicio)
    );

    const [fechaFinalizacion, setFechaFinalizacion] = useState(
        formatearFechaInput(proyectoAEditar?.fechaFinalizacion)
    );

    const [presupuesto, setPresupuesto] = useState(
        proyectoAEditar?.presupuesto || 0
    );

    const [estadoProyecto, setEstadoProyecto] = useState<EstadoProyecto>(
        proyectoAEditar?.estadoProyecto || 'PLANIFICACION'
    );

    const [estadoProceso, setEstadoProceso] = useState<EstadoProceso>(
        proyectoAEditar?.estadoProceso || 'EN_CURSO'
    );

    useEffect(() => {
        setNombreProyecto(proyectoAEditar?.nombre || '');

        setClienteSeleccionado(
            proyectoAEditar?.cliente || null
        );

        setCanalSolicitud(
            proyectoAEditar?.canalSolicitud || 'EMAIL'
        );

        setFechaInicio(
            formatearFechaInput(proyectoAEditar?.fechaInicio)
        );

        setFechaFinalizacion(
            formatearFechaInput(proyectoAEditar?.fechaFinalizacion)
        );

        setPresupuesto(
            proyectoAEditar?.presupuesto || 0
        );

        setEstadoProyecto(
            proyectoAEditar?.estadoProyecto || 'PLANIFICACION'
        );

        setEstadoProceso(
            proyectoAEditar?.estadoProceso || 'EN_CURSO'
        );
    }, [proyectoAEditar?.id]);

    return {
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
    };
}