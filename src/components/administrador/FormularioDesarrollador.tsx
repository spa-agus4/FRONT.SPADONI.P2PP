import { useState } from "react"
import type { Desarrollador, DesarrolladorAltaDTO } from "../../types"
import { useAuth } from '../../context/AuthContext'
import { crearDesarrollador } from '../../services/desarrolladorService'

import { Typography, Divider, Box, Alert } from '@mui/material'
import SwitchDisponibilidad from "../shared/CustomSwitch"

import { useNotification } from '../../context/NotificationContext';
import { traducirError } from '../../utils/errorManager';
import CampoTexto from "../shared/CampoTexto"

interface Props {
    onGuardar: (dev: Desarrollador) => void
    onCancelar: () => void
}

function FormularioDesarrollador({ onGuardar, onCancelar }: Props) {

    const [nombreDesarrollador, setNombreDesarrollador] = useState<string>('')
    const [disponible, setDisponible] = useState<boolean>(true)
    const [habilidades, setHabilidades] = useState<string>('')
    const { token, id } = useAuth()
    const { showNotification } = useNotification()
    const [error, setError] = useState<string | null>(null);

    const procesarError = (err: any) => {
        console.error(err);
        const msg = traducirError(err);
        showNotification(msg, 'error');
        //setError(msg);
    };


    const handleGuardar = () => {

        setError(null); // Limpiamos errores previos
        const errores: string[] = [];

        if (nombreDesarrollador.trim().length < 3) {
            errores.push("El nombre de desarrollador debe tener al menos 3 caracteres.");
        }

        // Verificar si hay errores
        if (errores.length > 0) {
            setError(errores.join(" | "));
            return;
        }

        if (habilidades === "")
            showNotification("Desarrollador creado sin habilidades", 'warning')

        // 1. Verificación de seguridad (Guarda)
        if (!token || !id) return;

        const datos: DesarrolladorAltaDTO = {
            nombre: nombreDesarrollador,
            habilidades: habilidades
        };

        crearDesarrollador(token, datos)
            .then((desarrolladorCreado) => {
                onGuardar(desarrolladorCreado)
                showNotification("¡Desarrollador creado con éxito!", 'success')
            })
            .catch(procesarError);
    };

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, display: 'flex', flexDirection: 'column', gap: 3, }}>

            <Box>
                <Typography
                    variant="h4"
                    sx={{
                        mb: 2,
                        fontWeight: 'bold',
                        textAlign: 'center',    // Lo centra en la caja
                        fontStyle: 'normal',    // saca el itálico heredado del Layout
                        textDecoration: 'none', // Asegura que no tenga subrayado
                    }}
                >
                    Nuevo Desarrollador
                </Typography>
                <Divider sx={{ mb: 2 }} />
            </Box>

            {/* EL ALERT DE ERRORES */}
            {error && (
                <Alert severity="error" sx={{ border: '1px solid #d32f2f' }}>
                    {error}
                </Alert>
            )}

            <CampoTexto label="NOMBRE" value={nombreDesarrollador}
                onChange={(e) => setNombreDesarrollador(e.target.value)}>
            </CampoTexto>

            <SwitchDisponibilidad
                valor={disponible}
                onChange={setDisponible}
                textoIzquierdo="No disponible"
                textoDerecho="Disponible"
            />

            <CampoTexto label="HABILIDADES" value={habilidades}
                onChange={(e) => setHabilidades(e.target.value)} maxLength={200} mostrarContador={true}></CampoTexto>

            <Box sx={{
                display: 'flex',
                justifyContent: 'center', // Centra horizontalmente en Flex
                alignItems: 'center',     // Centra verticalmente
                gap: 2,                   // Espacio entre Cancelar, Divider y Guardar
                fontStyle: 'normal'
            }}>
                <Typography
                    onClick={onCancelar}
                    sx={{
                        color: '#2e2c2c',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >Cancelar</Typography>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Typography
                    onClick={handleGuardar}
                    sx={{
                        color: 'blue',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >Guardar</Typography>
            </Box>
        </Box>
    )
}

export default FormularioDesarrollador