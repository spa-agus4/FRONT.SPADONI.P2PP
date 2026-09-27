import { useEffect, useState } from 'react';
import { useVistaFormulario } from '../hooks/useVistaFormulario';
import type { Cliente } from '../types';
import { listarClientes, eliminarCliente, habilitarCliente } from '../services/datosClienteService';
import { useNotification } from '../context/NotificationContext';
import { normalizarTexto } from '../utils/textUtils';
import { useModalEliminar } from '../hooks/useModalEliminar';
import { useProcesarError } from '../hooks/useProcesarError';


export function useGerenteCliente() {
    const { showNotification } = useNotification();
    const [clientes, setClientes] = useState<Cliente[]>([]);

    const { vista, itemAEditar, abrirParaCrear, abrirParaEditar, volverALista } = useVistaFormulario<Cliente>();

    const { open, seleccionado: clienteSeleccionado, abrirModal: handleAbrirModal, cerrarModal } = useModalEliminar<Cliente>();

    const { procesarError } = useProcesarError();

    // Cargar clientes al inicio
    useEffect(() => {
        listarClientes()
            .then(setClientes)
            .catch(console.error);
    }, []);

    const confirmarEliminar = () => {   // Inhabilitar cliente si tiene proyectos, no eliminarlo
        if (clienteSeleccionado) {
            eliminarCliente(clienteSeleccionado.id)
                .then((res) => {

                    // Si el backend devuelve el usuario y su propiedad 'activo' cambió a false:
                    if (res && res.activo === false) {
                        // NO lo eliminamos de la lista, solo actualizamos su campo 'activo' en el estado
                        setClientes(prev => prev.map(u =>
                            u.id === clienteSeleccionado.id ? { ...u, activo: false } : u
                        ));
                        showNotification("El cliente tiene proyectos asociados, fue inhabilitado.", 'warning');
                    } else {
                        // Si devolvió null (o un status sin cuerpo), significa que se borró físicamente
                        setClientes(prev => prev.filter(user => user.id !== clienteSeleccionado.id));
                        showNotification("Cliente eliminado con éxito!", 'success');
                    }
                    cerrarModal();
                })
                .catch(procesarError);
        }
    };

    const handleHabilitar = (c: Cliente) => {
        habilitarCliente(c.id)
            .then(() => {
                setClientes(prev => prev.map(u => u.id === c.id ? { ...u, activo: true } : u));
                showNotification(`Cliente ${c.nombre} habilitado con éxito`, 'success');
            })
            .catch(procesarError);
    };

    const handleGuardarFormulario = (clienteProcesado: Cliente) => {
        if (itemAEditar) {
            setClientes(prev => prev.map(c => c.id === clienteProcesado.id ? clienteProcesado : c));
        } else {
            setClientes(prev => [...prev, clienteProcesado]);
        }

        volverALista();
    };

    const [busqueda, setBusqueda] = useState('');
    const [ocultarInhabilitados, setOcultarInhabilitados] = useState(false);

    const clientesFiltrados = clientes.filter(c => {
        if (ocultarInhabilitados && c.activo === false) return false;

        const termino = normalizarTexto(busqueda.trim());
        if (termino === '') return true;

        return normalizarTexto(c.nombre).includes(termino)
            || normalizarTexto(c.email).includes(termino);
    });

    return {
        // Estados y datos
        clientes,
        busqueda,
        ocultarInhabilitados,
        clientesFiltrados,

        // Estados del Modal Eliminar
        open,
        clienteSeleccionado,

        // Estados de la Vista/Formulario
        vista,
        itemAEditar,

        // Setters
        setClientes,
        setBusqueda,
        setOcultarInhabilitados,

        // Acciones y Manejadores
        handleAbrirModal,
        cerrarModal,
        abrirParaCrear,
        abrirParaEditar,
        volverALista,
        confirmarEliminar,
        handleHabilitar,
        handleGuardarFormulario
    };
}