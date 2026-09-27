import { useState, useEffect } from 'react';
import type { Desarrollador, DesarrolladorEdicionDTO } from '../types';
import { listarDesarrolladores, eliminarDesarrollador, actualizarDesarrollador } from '../services/desarrolladorService';
import { useNotification } from '../context/NotificationContext';
import { useModalEliminar } from '../hooks/useModalEliminar';
import { useVistaFormulario } from '../hooks/useVistaFormulario';
import { useProcesarError } from '../hooks/useProcesarError';
import { normalizarTexto } from '../utils/textUtils';

export function useAdminDesarrolladores() {
    const [desarrolladores, setDesarrolladores] = useState<Desarrollador[]>([]);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [busqueda, setBusqueda] = useState('');
    const [filtroDisponibilidad, setFiltroDisponibilidad] = useState<'TODOS' | 'DISPONIBLE' | 'OCUPADO' | 'NO DISPONIBLE'>('TODOS');

    const { open, seleccionado: devSeleccionado, abrirModal: handleAbrirModal, cerrarModal } = useModalEliminar<Desarrollador>();
    const { vista, abrirParaCrear, volverALista } = useVistaFormulario<Desarrollador>();
    const { showNotification } = useNotification();
    const { procesarError } = useProcesarError();

    // Carga inicial
    useEffect(() => {
        listarDesarrolladores().then(setDesarrolladores).catch(procesarError);
    }, []);

    const handleGuardar = (datosRecibidos: Desarrollador) => {
        setError(null);
        const errores: string[] = [];

        if (editandoId === null) return;

        const devOriginal = desarrolladores.find(d => d.id === editandoId);
        if (!devOriginal) return;

        const huboCambioNombre = datosRecibidos.nombre !== devOriginal.nombre;
        const huboCambioHabilidades = datosRecibidos.habilidades !== devOriginal.habilidades;
        const huboCambioDisponibilidad = datosRecibidos.disponible !== devOriginal.disponible;

        if (!huboCambioNombre && !huboCambioHabilidades && !huboCambioDisponibilidad) {
            showNotification("No se detectaron cambios para actualizar.", "warning");
            return;
        }

        if (datosRecibidos.nombre.trim().length < 3) {
            errores.push("El nombre de usuario debe tener al menos 3 caracteres.");
        }

        if (errores.length > 0) {
            setError(errores.join(" | "));
            return;
        }

        const datosParaEnviar: DesarrolladorEdicionDTO = {};

        if (datosRecibidos.nombre !== '') datosParaEnviar.nombre = datosRecibidos.nombre;
        if (datosRecibidos.habilidades !== '') datosParaEnviar.habilidades = datosRecibidos.habilidades;
        datosParaEnviar.disponible = datosRecibidos.disponible;

        actualizarDesarrollador(editandoId, datosParaEnviar)
            .then((devActualizado) => {
                setDesarrolladores(prev => prev.map(d => d.id === editandoId ? devActualizado : d));
                setEditandoId(null);

                if ((devOriginal.proyecto != null && !devOriginal.disponible) && datosRecibidos.disponible) {
                    showNotification("Se removió al desarrollador de su proyecto", 'warning');
                } else {
                    showNotification("Desarrollador actualizado con éxito", "success");
                }
            })
            .catch(procesarError);
    };

    const confirmarEliminar = () => {
        if (devSeleccionado) {
            eliminarDesarrollador(devSeleccionado.id)
                .then(() => {
                    setDesarrolladores(prev => prev.filter(dev => dev.id !== devSeleccionado.id));
                    cerrarModal();
                    showNotification("Desarrollador eliminado con éxito", "success");
                }).catch(procesarError);
        }
    };

    const actualizarLista = (desarrolladorCreado: Desarrollador) => {
        volverALista();
        setDesarrolladores([...desarrolladores, desarrolladorCreado]);
    };

    // Lógica de filtrado
    const desarrolladoresVisibles = desarrolladores.filter(dev => {
        if (filtroDisponibilidad === 'DISPONIBLE' && !dev.disponible) return false;
        if (filtroDisponibilidad === 'OCUPADO' && (dev.disponible || dev.proyecto === null)) return false;
        if (filtroDisponibilidad === 'NO DISPONIBLE' && (dev.disponible || dev.proyecto !== null)) return false;

        const termino = normalizarTexto(busqueda.trim());
        if (termino === '') return true;

        return normalizarTexto(dev.nombre).includes(termino);
    });

    return {
        // Estados y datos derivados
        desarrolladores,
        desarrolladoresVisibles,
        editandoId,
        error,
        busqueda,
        filtroDisponibilidad,
        open,
        devSeleccionado,
        vista,
        
        // Setters simples
        setEditandoId,
        setError,
        setBusqueda,
        setFiltroDisponibilidad,
        
        // Acciones y manejadores
        handleAbrirModal,
        cerrarModal,
        abrirParaCrear,
        volverALista,
        handleGuardar,
        confirmarEliminar,
        actualizarLista
    };
}