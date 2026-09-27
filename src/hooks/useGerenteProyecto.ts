import { useEffect, useState } from 'react';
import type { Proyecto, Cliente } from '../types';
import { listarProyectos, eliminarProyecto } from '../services/proyectoService';
import { listarClientes } from '../services/datosClienteService'; // <-- Traemos el servicio para poblar el filtro
import { useNotification } from '../context/NotificationContext';
import { normalizarTexto } from '../utils/textUtils';
import { useModalEliminar } from '../hooks/useModalEliminar';
import { useVistaFormulario } from '../hooks/useVistaFormulario';
import { useProcesarError } from '../hooks/useProcesarError';

interface UseGerenteProyectoProps {
    filtroInicial?: number | 'TODOS';
}

export function useGerenteProyecto({ filtroInicial }: UseGerenteProyectoProps) {
    const { showNotification } = useNotification();
    const [proyectos, setProyectos] = useState<Proyecto[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]); // <-- Estado para los clientes del filtro

    // Inicializamos estados de los filtros usando el valor propulsado por el Layout
    const [busqueda, setBusqueda] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState<Proyecto['estadoProceso'] | 'TODOS'>('TODOS');

    const { open, seleccionado: proyectoSeleccionado, abrirModal: handleAbrirModal, cerrarModal } = useModalEliminar<Proyecto>();

    const { vista, itemAEditar, abrirParaCrear, abrirParaEditar, volverALista } = useVistaFormulario<Proyecto>();

    const { procesarError } = useProcesarError();

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
        listarProyectos().then(setProyectos).catch(procesarError);
        listarClientes().then(setClientes).catch(procesarError);
    }, []);

    const confirmarEliminar = () => {
        if (proyectoSeleccionado) {
            eliminarProyecto(proyectoSeleccionado.id)
                .then(() => {
                    setProyectos(prev => prev.filter(p => p.id !== proyectoSeleccionado.id));
                    cerrarModal();
                    showNotification("Proyecto eliminado con éxito", "success");
                }).catch(procesarError);
        }
    }

    const handleGuardarFormulario = (proyectoProcesado: Proyecto) => {
        if (itemAEditar) {
            setProyectos(prev => prev.map(p => p.id === proyectoProcesado.id ? proyectoProcesado : p));
        } else {
            setProyectos(prev => [...prev, proyectoProcesado]);
        }

        volverALista();
    };

    // --- FILTRADO EN MEMORIA --- (filtro de proyecto o cliente)
    const proyectosFiltrados = proyectos.filter(p => {
        if (estadoFiltro !== 'TODOS' && p.estadoProceso !== estadoFiltro) return false;

        const termino = normalizarTexto(busqueda.trim());
        if (termino === '') return true;

        return normalizarTexto(p.nombre).includes(termino)
            || normalizarTexto(p.cliente?.nombre ?? '').includes(termino);
    });

    return {
        // Estados y datos
        busqueda,
        estadoFiltro,
        proyectosFiltrados,
        // Estados del Modal Eliminar
        open,
        proyectoSeleccionado,
        // Estados de la Vista/Formulario
        vista,
        itemAEditar,
        // Setters
        setBusqueda,
        setEstadoFiltro,
        setProyectos,
        // Acciones y Manejadores
        handleAbrirModal,
        cerrarModal,
        abrirParaCrear,
        abrirParaEditar,
        volverALista,
        confirmarEliminar,
        handleGuardarFormulario
    };
}