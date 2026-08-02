import { useState } from "react"
import type { Cliente, ClienteDatosDTO } from "../../types"
import { useAuth } from '../../context/AuthContext'
import { crearCliente, actualizarCliente } from '../../services/datosClienteService' // Ajustá las rutas a tus servicios reales

import { Typography, Divider, Box, Alert } from '@mui/material'

import { useNotification } from '../../context/NotificationContext';
import { traducirError } from '../../utils/errorManager';
import CampoTexto from "../shared/CampoTexto"

interface Props {
    clienteAEditar?: Cliente | null; // Prop opcional para saber si editamos o creamos
    onGuardar: (cliente: Cliente) => void
    onCancelar: () => void
}

function FormularioCliente({ clienteAEditar, onGuardar, onCancelar }: Props) {

    // --- ESTADOS INTERNOS ---
    const [nombreCliente, setNombreCliente] = useState<string>(clienteAEditar?.nombre || '')
    const [telefono, setTelefono] = useState<string>(clienteAEditar?.telefono || '')
    const [email, setEmail] = useState<string>(clienteAEditar?.email || '')
    const [direccion, setDireccion] = useState<string>(clienteAEditar?.direccion || '')

    const { token, id } = useAuth()
    const { showNotification } = useNotification()
    const [error, setError] = useState<string | null>(null);

    const procesarError = (err: any) => {
        console.error(err);
        const msg = traducirError(err);
        showNotification(msg, 'error');
    };

    const handleGuardar = () => {
        setError(null);
        const errores: string[] = [];

        // --- VALIDACIONES MÍNIMAS ---
        if (nombreCliente.trim().length < 3) {
            errores.push("El nombre del cliente debe tener al menos 3 caracteres.");
        }
        if (email.trim().length === 0) {
            errores.push("El email es obligatorio.");
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errores.push("El formato del email no es válido.");
        }
        if (direccion.trim().length === 0) {
            errores.push("La dirección es obligatoria.");
        }

        if (errores.length > 0) {
            setError(errores.join(" | "));
            return;
        }

        if (!token || !id) return;

        // # Borrar si no lo uso
        const cliente = {
            ...clienteAEditar, // Si estamos editando, mantenemos propiedades de fondo como el usuario viejo
            nombre: nombreCliente,
            telefono: telefono,
            email: email,
            direccion: direccion
        } as Cliente;

        const datos: ClienteDatosDTO = {
            nombre: nombreCliente,
            telefono: telefono,
            email: email,
            direccion: direccion
        };

        if (clienteAEditar?.id) {
            actualizarCliente(token, clienteAEditar.id, datos)
                .then((clienteActualizado) => {
                    onGuardar(clienteActualizado);
                    showNotification("¡Cliente actualizado con éxito!", 'success');
                })
                .catch(procesarError);
        } else {
            crearCliente(token, datos)
                .then((clienteCreado) => {
                    onGuardar(clienteCreado);
                    showNotification("¡Cliente creado con éxito!", 'success');
                })
                .catch(procesarError);
        }
    };

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, display: 'flex', flexDirection: 'column', gap: 3, }}>

            <Box>
                <Typography
                    variant="h4"
                    sx={{
                        mb: 2,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontStyle: 'normal',
                        textDecoration: 'none',
                    }}
                >
                    {clienteAEditar ? "Editar Cliente" : "Nuevo Cliente"}
                </Typography>
                <Divider sx={{ mb: 2 }} />
            </Box>

            {/* ALERTA DE ERRORES */}
            {error && (
                <Alert severity="error" sx={{ border: '1px solid #d32f2f' }}>
                    {error}
                </Alert>
            )}

            {/* CAMPOS REQUERIDOS Y OPCIONALES */}
            <CampoTexto
                label="NOMBRE CLIENTE"
                variant="outlined"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                maxLength={80}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
                <CampoTexto
                    label="TELÉFONO"
                    variant="outlined"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    sx={{ flex: 1 }}
                    maxLength={20}
                />
                <CampoTexto
                    label="EMAIL"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ flex: 2 }}
                    maxLength={100}
                />
            </Box>

            <CampoTexto
                label="DIRECCIÓN"
                variant="outlined"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                maxLength={150}
            />

            {/* BOTONES ACCIONES */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                fontStyle: 'normal'
            }}>
                <Typography
                    onClick={onCancelar}
                    sx={{
                        color: '#2e2c2c',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    Cancelar
                </Typography>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Typography
                    onClick={handleGuardar}
                    sx={{
                        color: 'blue',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    Guardar
                </Typography>
            </Box>
        </Box>
    )
}

export default FormularioCliente;