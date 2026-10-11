import { useEffect, useState } from "react";
import type { Cliente, Desarrollador, Proyecto } from "../types";
import { listarClientes } from "../services/datosClienteService";
import { listarDesarrolladores, listarAsignadosActualesPorProyecto, listarHistorialPorProyecto } from "../services/desarrolladorService";
import { useProcesarError } from "./useProcesarError";

export function useDatosFormularioProyecto(proyectoAEditar?: Proyecto | null, esLecturaOnly: boolean = false) {

    const [listaClientes, setListaClientes] = useState<Cliente[]>([]);
    const [listaDevs, setListaDevs] = useState<Desarrollador[]>([]);
    const [devsSeleccionados, setDevsSeleccionados] = useState<Desarrollador[]>([]);
    const [historialDesarrolladores, setHistorialDesarrolladores] = useState<Desarrollador[]>([]);

    const { procesarError } = useProcesarError();

    const agregarCliente = (cliente: Cliente) => {
        setListaClientes(prev => [...prev, cliente]);
    };

    // Clientes disponibles para el formulario
    useEffect(() => {
        if (esLecturaOnly) {
            return;
        }

        listarClientes()
            .then(setListaClientes)
            .catch(procesarError);
    }, [esLecturaOnly]);

    // Desarrolladores que pueden seleccionarse en el formulario
    useEffect(() => {
        if (esLecturaOnly) {
            return;
        }

        listarDesarrolladores()
            .then((data) => {
                const filtrados = data.filter((dev) =>
                    dev.disponible === true ||
                    dev.proyecto?.id === proyectoAEditar?.id
                );

                setListaDevs(filtrados);
            })
            .catch(procesarError);
    }, [esLecturaOnly, proyectoAEditar?.id]);

    // Asignaciones actuales del proyecto
    useEffect(() => {
        if (!proyectoAEditar?.id) {
            return;
        }

        listarAsignadosActualesPorProyecto(proyectoAEditar.id)
            .then(setDevsSeleccionados)
            .catch(procesarError);
    }, [proyectoAEditar?.id]);

    // Historial completo de participantes del proyecto
    useEffect(() => {
        const proyectoId = proyectoAEditar?.id;

        if (!proyectoId) {
            setHistorialDesarrolladores([]);
            return;
        }

        setHistorialDesarrolladores([]);

        listarHistorialPorProyecto(proyectoId)
            .then(setHistorialDesarrolladores)
            .catch(procesarError);
    }, [proyectoAEditar?.id]);

    return {
        listaClientes,
        agregarCliente,
        listaDevs,
        devsSeleccionados,
        setDevsSeleccionados,
        historialDesarrolladores
    };
}