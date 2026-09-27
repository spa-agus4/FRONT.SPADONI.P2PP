import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

export interface AccionBoton {
    texto: string;
    onClick: () => void;
    color?: string;
}

interface BotoneraAccionesProps {
    acciones: AccionBoton[];
}

export default function BotoneraAcciones({ acciones }: BotoneraAccionesProps) {
    if (!acciones || acciones.length === 0) return null;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, fontStyle: 'normal' }}>
            {acciones.map((accion, index) => (
                <React.Fragment key={index}>
                    {/* mete un divider si no es el primer botón */}
                    {index > 0 && <Divider orientation="vertical" variant="middle" flexItem />}
                    
                    <Typography
                        onClick={accion.onClick}
                        sx={{
                            color: accion.color || '#2e2c2c',
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' }
                        }}
                    >
                        {accion.texto}
                    </Typography>
                </React.Fragment>
            ))}
        </Box>
    );
}