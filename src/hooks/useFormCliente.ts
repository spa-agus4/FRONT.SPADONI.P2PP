import { useState } from "react"
import type { Cliente, ClienteDatosDTO } from "../types"
import { crearCliente, actualizarCliente, eliminarCliente } from '../services/datosClienteService'
import { useNotification } from '../context/NotificationContext';
import { useProcesarError } from "../hooks/useProcesarError";
import { validarFormularioCliente } from "../utils/validations/validarFormularioCliente";
import { useModalEliminar } from "./useModalEliminar";

interface UseFormClienteProps {
    onGuardar: (cliente: Cliente) => void;
    onEliminar?: (id: number) => void;
    clienteAEditar?: Cliente | null;
}

export function useFormCliente({ onGuardar, onEliminar, clienteAEditar }: UseFormClienteProps) {

    // --- ESTADOS INTERNOS ---
    const [nombreCliente, setNombreCliente] = useState<string>(clienteAEditar?.nombre || '')
    const [telefono, setTelefono] = useState<string>(clienteAEditar?.telefono || '')
    const [email, setEmail] = useState<string>(clienteAEditar?.email || '')
    const [direccion, setDireccion] = useState<string>(clienteAEditar?.direccion || '')

    const { open, seleccionado: clienteSeleccionado, abrirModal: handleAbrirModal, cerrarModal } = useModalEliminar<Cliente>();
    
    const { showNotification } = useNotification()
    const { procesarError } = useProcesarError();
    const [error, setError] = useState<string | null>(null);

    const HandleAbrirModalEliminar = () => {
        if (clienteAEditar) {
            handleAbrirModal(clienteAEditar);
        }
    };

    const handleGuardar = () => {
        setError(null);

        // --- VALIDACIONES MÍNIMAS ---
        const errores = validarFormularioCliente(nombreCliente, email, direccion, telefono);

        if (errores.length > 0) {
            setError(errores.join(" | "));
            return;
        }

        const datos: ClienteDatosDTO = {
            nombre: nombreCliente,
            telefono: telefono,
            email: email,
            direccion: direccion
        };

        if (clienteAEditar?.id) {
            actualizarCliente(clienteAEditar.id, datos)
                .then((clienteActualizado) => {
                    onGuardar(clienteActualizado);
                    showNotification("¡Cliente actualizado con éxito!", 'success');
                })
                .catch(procesarError);
        } else {
            crearCliente(datos)
                .then((clienteCreado) => {
                    onGuardar(clienteCreado);
                    showNotification("¡Cliente creado con éxito!", 'success');
                })
                .catch(procesarError);
        }
    };

    const confirmarEliminar = () => {   // Inhabilitar cliente si tiene proyectos, no eliminarlo
            if (clienteSeleccionado) {
                eliminarCliente(clienteSeleccionado.id)
                    .then((res) => {
    
                        // Si el backend devuelve el usuario y su propiedad 'activo' cambió a false:
                        if (res && res.activo === false) {
                            // NO lo eliminamos de la lista, solo actualizamos su campo 'activo' en el estado
                            showNotification("El cliente tiene proyectos asociados, fue inhabilitado.", 'warning');
                        } else {
                            // Si devolvió null (o un status sin cuerpo), significa que se borró físicamente
                            showNotification("Cliente eliminado con éxito!", 'success');
                        }
                        cerrarModal();
                    })
                    .catch(procesarError);
            }
        };

    return {
        // Estados
        nombreCliente,
        telefono,
        email,
        direccion,
        error,
        // Setters
        setNombreCliente,
        setTelefono,
        setEmail,
        setDireccion,
        // Acciones y manejadores
        handleGuardar,
        confirmarEliminar,
        HandleAbrirModalEliminar,
        cerrarModal,
        // Modal
        open,
        clienteSeleccionado,
    };
}