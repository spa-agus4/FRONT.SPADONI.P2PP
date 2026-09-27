import { useState, useEffect } from 'react';
import type { Proyecto } from '../types';
import { listarProyectos } from '../services/proyectoService';
import { useNotification } from '../context/NotificationContext';
import { useVistaFormulario } from '../hooks/useVistaFormulario';
import { normalizarTexto } from '../utils/textUtils';

export function useClienteProyectos() {
    const { showNotification } = useNotification();
    const [proyectos, setProyectos] = useState<Proyecto[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);

    const { vista, itemAEditar: proyectoAVer, abrirParaEditar: handleAbrirDetalle, volverALista } = useVistaFormulario<Proyecto>();

    // Inicializamos estados de los filtros usando el valor propulsado por el Layout
    const [busqueda, setBusqueda] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState<Proyecto['estadoProceso'] | 'TODOS'>('TODOS');
    const [filtroInicial, setFiltroInicial] = useState("TODOS")

    // Si el filtroInicial cambia desde afuera (Layout), actualizamos el estado interno
    useEffect(() => {
        if (filtroInicial === 'TODOS') {
            setBusqueda('');
            return;
        }
        const proyecto = proyectos.find(p => p.nombre === filtroInicial);
        if (proyecto) setBusqueda(proyecto.nombre);
    }, [filtroInicial]);

    useEffect(() => {
        setCargando(true);
        listarProyectos()
            .then((data) => {
                setProyectos(data);
            })
            .catch((err) => {
                console.error("Error al obtener proyectos:", err);
                showNotification("No se pudieron cargar tus proyectos", "error");
            })
            .finally(() => setCargando(false));
    }, []);

    // Filtrado por nombre proyecto
    const proyectosFiltrados = proyectos.filter(p => {
        if (estadoFiltro !== 'TODOS' && p.estadoProceso !== estadoFiltro) return false;

        // Si la barra de búsqueda está vacía, pasa el filtro
        const termino = normalizarTexto(busqueda.trim());
        if (termino === '') return true;

        return normalizarTexto(p.nombre).includes(termino);
    });

    return {
        // Estados / Datos
        cargando,
        busqueda,
        estadoFiltro,
        proyectosFiltrados,
        vista,
        proyectoAVer,

        // Setters
        setBusqueda,
        setEstadoFiltro,

        // Acciones
        handleAbrirDetalle,
        volverALista
    };
}