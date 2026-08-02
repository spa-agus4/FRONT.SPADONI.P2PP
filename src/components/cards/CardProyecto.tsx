import { Box, Card, Chip, IconButton, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PersonIcon from '@mui/icons-material/Person'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

import type { EstadoProceso, Proyecto } from '../../types'
import { useState } from 'react'

interface Props {
    p: Proyecto;
    onEditar?: (proyecto: Proyecto) => void;   // <-- Opcional con "?"
    onEliminar?: (proyecto: Proyecto) => void; // <-- Opcional con "?"
    acciones?: (datos?: Proyecto) => React.ReactNode
}

const ESTADOS_PROCESO: Record<EstadoProceso, { label: string; color: 'default' | 'primary' | 'error' }> = {
    EN_CURSO: { label: 'En curso', color: 'default' },
    COMPLETADO: { label: 'Completado', color: 'primary' },
    CANCELADO: { label: 'Cancelado', color: 'error' }
}

export default function CardProyecto({ p, acciones }: Props) {

    const formatearFecha = (fecha: any) => {
        if (!fecha) return 'N/A';
        const d = new Date(fecha);
        return d.toLocaleDateString('es-AR');
    };

    // Verificamos si existe al menos una acción disponible
    const tieneAcciones = Boolean(acciones);

    const [estadoProceso, setEstadoProceso] = useState<EstadoProceso>(p?.estadoProceso || 'EN_CURSO')

    return (
        <Card sx={{
            display: 'flex',
            '&:not(:first-of-type)': { mt: 1.5 },
            minHeight: 100
        }}>

            {/* ID - Columna izquierda */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '8%',
                backgroundColor: '#616161',
            }}>
                <Typography
                    //onClick={() => onEditar && onEditar(p)} // Solo ejecuta si existe onEditar
                    sx={{
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '1.3rem',
                        //cursor: onEditar ? 'pointer' : 'default' // Cursor normal si es un cliente
                    }}
                >
                    {p.id}
                </Typography>
            </Box>

            {/* INFO PRINCIPAL */}
            <Box sx={{ display: 'flex', flexDirection: 'column', width: tieneAcciones ? '50%' : '58%', padding: 1.5, gap: 0.5 }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', mb: 0.5 }}>
                    {p.nombre}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#555' }}>
                    <PersonIcon sx={{ fontSize: '1.1rem' }} />
                    <Typography sx={{ fontSize: '0.9rem' }}>
                        Cliente: <strong>{p.cliente?.nombre || 'N/A'}</strong>
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#555' }}>
                    <CalendarMonthIcon sx={{ fontSize: '1.1rem' }} />
                    <Typography sx={{ fontSize: '0.9rem' }}>
                        F. Inicio: {formatearFecha(p.fechaInicio)}
                    </Typography>
                </Box>
            </Box>

            {/* PRESUPUESTO Y ESTADO */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: tieneAcciones ? '32%' : '34%',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1
            }}>
                <Typography sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                    Presupuesto: ${p.presupuesto?.toLocaleString('es-AR')}
                </Typography>

                <Chip
                    label={ESTADOS_PROCESO[estadoProceso].label}
                    color={ESTADOS_PROCESO[estadoProceso].color}
                    variant="outlined" size="small"
                    sx={{ fontWeight: 'bold', width: '120px' }}
                />
            </Box>

            {/* ACCIONES (Solo se muestra si se pasa al menos una función) */}
            {tieneAcciones && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '10%',
                    gap: 1
                }}>
                    {acciones?.(p)}
                </Box>
            )}
        </Card>
    );
}