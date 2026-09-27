import { Box } from '@mui/material';
import React from 'react';

interface ContenedorScrollProps {
    children: React.ReactNode;
    alturaMaxima?: number | string;
}

export default function ContenedorScroll({ children, alturaMaxima = 370 }: ContenedorScrollProps) {
    return (
        <Box
            sx={{
                maxHeight: alturaMaxima,
                minHeight: alturaMaxima, // Mantiene la altura fija para que no salte la pantalla
                marginTop: 2,
                overflowY: 'auto', // Asegura que scrollee si se pasa
                
                // --- ESTILOS ESTÁNDAR DEL SCROLLBAR PARA TODA LA APP ---
                '&::-webkit-scrollbar': { 
                    width: '10px', 
                    height: '10px' 
                },
                '&::-webkit-scrollbar-thumb': { 
                    backgroundColor: '#888', 
                    borderRadius: '10px' 
                },
                '&::-webkit-scrollbar-thumb:hover': { 
                    backgroundColor: '#555' 
                },
                '&::-webkit-scrollbar-button': { 
                    display: 'none' 
                }
            }}
        >
            {children}
        </Box>
    );
}