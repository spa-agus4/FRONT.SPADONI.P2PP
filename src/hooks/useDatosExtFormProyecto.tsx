import { useEffect, useState } from "react";
import type { Cliente, Desarrollador, Proyecto } from "../types";
import { listarClientes } from "../services/datosClienteService";
import { listarDesarrolladores, listarDesarrolladoresPorProyecto } from "../services/desarrolladorService";
import { useProcesarError } from "./useProcesarError";

export function useDatosFormularioProyecto(proyectoAEditar?: Proyecto | null, esLecturaOnly: boolean = false) {

    const [listaClientes, setListaClientes] = useState<Cliente[]>([]);
    const [listaDevs, setListaDevs] = useState<Desarrollador[]>([]);
    const [devsSeleccionados, setDevsSeleccionados] = useState<Desarrollador[]>([]);

    const { procesarError } = useProcesarError();

    const agregarCliente = (cliente: Cliente) => {
        setListaClientes(prev => [...prev, cliente]);
    };

    useEffect(() => {
        if (esLecturaOnly) {
            return;
        }

        listarClientes()
            .then(setListaClientes)
            .catch(procesarError);
    }, [esLecturaOnly]);

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

    useEffect(() => {
        if (!proyectoAEditar?.id) {
            return;
        }

        listarDesarrolladoresPorProyecto(proyectoAEditar.id)
            .then(setDevsSeleccionados)
            .catch(procesarError);
    }, [proyectoAEditar?.id]);

    return {
        listaClientes,
        agregarCliente,
        listaDevs,
        devsSeleccionados,
        setDevsSeleccionados
    };
}