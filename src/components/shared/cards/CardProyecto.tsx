import { Box, Chip, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import CardGeneral from './CardGeneral';
import type { EstadoProceso, Proyecto } from '../../../types';
import { formatearFechaVista } from '../../../utils/dateUtils'

interface Props {
    p: Proyecto;
    acciones?: React.ReactNode;
}

const ESTADOS_PROCESO: Record<EstadoProceso, { label: string; color: 'default' | 'primary' | 'error' }> = {
    EN_CURSO: { label: 'En curso', color: 'default' },
    COMPLETADO: { label: 'Completado', color: 'primary' },
    CANCELADO: { label: 'Cancelado', color: 'error' }
};

export default function CardProyecto({ p, acciones }: Props) {

    const principal = (
        <>
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
                    F. Inicio: {formatearFechaVista(p.fechaInicio)}
                </Typography>
            </Box>
        </>
    );

    const extra = (
        <>
            <Typography sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                Presupuesto: ${p.presupuesto?.toLocaleString('es-AR')}
            </Typography>
            <Chip
                label={ESTADOS_PROCESO[p.estadoProceso].label}
                color={ESTADOS_PROCESO[p.estadoProceso].color}
                variant="outlined" size="small"
                sx={{ fontWeight: 'bold', width: '120px' }}
            />
        </>
    );

    return (
        <CardGeneral 
            id={p.id}
            contenidoPrincipal={principal}
            contenidoExtra={extra}
            acciones={acciones}
        />
    );
}