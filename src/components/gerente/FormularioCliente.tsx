import type { Cliente } from "../../types"

import { Box } from '@mui/material'
import CampoTexto from "../shared/CampoTexto"
import FormularioGeneral from "../shared/formularios/FormularioGeneral";
import { useFormCliente } from "../../hooks/useFormCliente";

interface Props {
    clienteAEditar?: Cliente | null;
    onGuardar: (cliente: Cliente) => void
    onCancelar: () => void
}

function FormularioCliente({ clienteAEditar, onGuardar, onCancelar }: Props) {

    const {
        nombreCliente,
        telefono,
        email,
        direccion,
        error,
        setNombreCliente,
        setTelefono,
        setEmail,
        setDireccion,
        handleGuardar
    } = useFormCliente({ clienteAEditar, onGuardar });

    return (
        <FormularioGeneral
            // El título cambia dinámicamente si hay clienteAEditar
            titulo={clienteAEditar ? "Editar Cliente" : "Nuevo Cliente"}
            error={error}
            onGuardar={handleGuardar}
            onCancelar={onCancelar}

            textoGuardar={clienteAEditar ? "Actualizar" : "Crear"}
        >
            {/* CAMPOS REQUERIDOS Y OPCIONALES */}
            <CampoTexto
                label="NOMBRE CLIENTE"
                variant="outlined"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                maxLength={80}
                mostrarContador={true}
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
        </FormularioGeneral>
    )
}

export default FormularioCliente;