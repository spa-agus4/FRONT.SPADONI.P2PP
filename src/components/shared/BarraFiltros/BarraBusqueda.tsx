import React from 'react';
import { Box, TextField, InputAdornment, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface BarraBusquedaProps {
    busqueda: string;
    onBusquedaChange: (valor: string) => void;
    placeholder?: string;
    maxWidth?: number | string;
    minHeight?: number | string;
    backgroundColor?: string;
    borderColor?: string;
    children?: React.ReactNode; // Acá inyectamos los Selects o Checkboxes específicos de cada vista
}

export default function BarraBusqueda({
    busqueda,
    onBusquedaChange,
    placeholder = "Buscar...",
    maxWidth = 580, // Valor estándar para la mayoría de tus vistas
    minHeight = 52,
    backgroundColor = 'white', // Color por defecto
    borderColor= '#e0e0e0',
    children
}: BarraBusquedaProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                mt: 1,
                backgroundColor: backgroundColor,
                border: '1px solid',
                borderColor: borderColor,
                borderRadius: '12px',
                padding: '4px 16px',
                maxWidth: maxWidth,
                minHeight : minHeight,
                flex: 1 // Útil para cuando esté en flex containers, como en AdminUsuarios
            }}
        >
            <TextField
                variant="standard"
                placeholder={placeholder}
                value={busqueda}
                onChange={(e) => onBusquedaChange(e.target.value)}
                InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: '#888', fontSize: 20 }} />
                        </InputAdornment>
                    )
                }}
                sx={{ flex: 1 }}
            />

            {/* Renderiza el divisor y los filtros extra solo si la vista los pasa por prop */}
            {children && (
                <>
                    <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
                    {children}
                </>
            )}
        </Box>
    );
}