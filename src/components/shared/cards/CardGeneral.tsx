import { Box, Card, Typography } from '@mui/material';

interface CardGeneralProps {
    id: number | string;
    contenidoPrincipal: React.ReactNode;
    contenidoExtra?: React.ReactNode; // Opcional (para Ver Proyectos o Presupuesto)
    acciones?: React.ReactNode;       // Opcional (botones derechos)
}

export default function CardGeneral({ id, contenidoPrincipal, contenidoExtra, acciones }: CardGeneralProps) {
    return (
        <Card sx={{
            display: 'flex',
            minHeight: 100,
            '&:not(:first-of-type)': { mt: 1.5 }
        }}>
            {/* 1. COLUMNA ID (Fija) */}
            <Box 
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '8%',
                    minWidth: '60px',
                    backgroundColor: '#616161'
                }}
            >
                <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.3rem' }}>
                    {id}
                </Typography>
            </Box>

            {/* 2. CONTENIDO PRINCIPAL (Flexible, toma el espacio sobrante) */}
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                flex: 1, // reemplazamos los anchos con porcentajes
                padding: 1.5, 
                gap: 0.5 
            }}>
                {contenidoPrincipal}
            </Box>

            {/* 3. CONTENIDO EXTRA (Presupuesto, proyectos) */}
            {contenidoExtra && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '32%', 
                    gap: 1
                }}>
                    {contenidoExtra}
                </Box>
            )}

            {/* 4. ACCIONES (Eliminar, editar, visualizar, etc) */}
            {acciones && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '10%',
                    minWidth: '60px',
                    borderLeft: '1px solid #eee',
                    gap: 0.5
                }}>
                    {acciones}
                </Box>
            )}
        </Card>
    );
}