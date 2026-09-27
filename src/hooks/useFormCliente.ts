import { useState } from "react"
import type { Cliente, ClienteDatosDTO } from "../types"
import { crearCliente, actualizarCliente } from '../services/datosClienteService'
import { useNotification } from '../context/NotificationContext';
import { useProcesarError } from "../hooks/useProcesarError";
import { validarFormularioCliente } from "../utils/validations/validarFormularioCliente";

interface UseFormClienteProps {
    onGuardar: (cliente: Cliente) => void;
    clienteAEditar?: Cliente | null;
}

export function useFormCliente({ onGuardar, clienteAEditar }: UseFormClienteProps) {

    // --- ESTADOS INTERNOS ---
    const [nombreCliente, setNombreCliente] = useState<string>(clienteAEditar?.nombre || '')
    const [telefono, setTelefono] = useState<string>(clienteAEditar?.telefono || '')
    const [email, setEmail] = useState<string>(clienteAEditar?.email || '')
    const [direccion, setDireccion] = useState<string>(clienteAEditar?.direccion || '')

    const { showNotification } = useNotification()
    const { procesarError } = useProcesarError();
    const [error, setError] = useState<string | null>(null);

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
        // Acciones
        handleGuardar
    };
}