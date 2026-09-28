import React from 'react';
import { Box, Typography, Divider, Alert } from '@mui/material';
import BotoneraAcciones from '../botones/BotoneraAcciones';

interface FormularioGeneral {
    titulo: string;
    error?: string | null;
    onGuardar: () => void;
    onCancelar: () => void;
    onEliminar?: () => void;
    textoGuardar?: string;   // Opcional por si algún día querés que diga "Crear" o "Actualizar"
    textoCancelar?: string;
    textoEliminar?: string;
    children: React.ReactNode; // Acá adentro van a ir los campos de texto, switches, etc.
}

export default function FormularioGeneral({
    titulo,
    error,
    onGuardar,
    onCancelar,
    onEliminar,
    textoGuardar = "Crear",
    textoCancelar = "Cancelar",
    textoEliminar = "Eliminar",
    children
}: FormularioGeneral) {
    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* TÍTULO Y SEPARADOR */}
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
                    {titulo}
                </Typography>
                <Divider sx={{ mb: 2 }} />
            </Box>

            {/* ALERTA DE ERRORES GENÉRICA */}
            {error && (
                <Alert severity="error" sx={{ border: '1px solid #d32f2f' }}>
                    {error}
                </Alert>
            )}

            {/* CONTENIDO DEL FORMULARIO (LOS CAMPOS) */}
            {children}

            {/* BOTONES DE ACCIÓN */}
            <BotoneraAcciones
                acciones={[
                    { texto: textoCancelar, onClick: onCancelar },
                    { texto: textoGuardar, onClick: onGuardar, color: 'blue' },
                    ...(onEliminar ? [{ texto: textoEliminar, onClick: onEliminar, color: 'red' }] : [])
                ]}
            />
        </Box>
    );
}