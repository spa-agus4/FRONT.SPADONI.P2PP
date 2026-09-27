import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import HomeIcon from '@mui/icons-material/Home';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

import CardGeneral from './CardGeneral';
import type { Cliente } from '../../../types';

interface Props {
    c: Cliente;
    onVerProyectos: () => void;
    acciones?: React.ReactNode;
}

export default function CardCliente({ c, onVerProyectos, acciones }: Props) {
       
    const principal = (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#212121' }}>
                    {c.nombre}
                </Typography>
                {!c.activo && (
                    <Chip label="Inhabilitado" size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600, backgroundColor: '#eeeeee', color: '#757575' }} />
                )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#555' }}>
                    <PhoneIcon sx={{ fontSize: '1.1rem', color: '#757575' }} />
                    <Typography sx={{ fontSize: '0.9rem' }}>{c.telefono || 'Sin teléfono'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#555' }}>
                    <MailOutlineIcon sx={{ fontSize: '1.1rem', color: '#757575' }} />
                    <Typography sx={{ fontSize: '0.9rem' }}>{c.email}</Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#555', mt: 0.5 }}>
                <HomeIcon sx={{ fontSize: '1.1rem', color: '#757575' }} />
                <Typography sx={{ fontSize: '0.9rem' }}>{c.direccion || 'Sin dirección registrada'}</Typography>
            </Box>
        </>
    );

    const extra = (
        <Box onClick={onVerProyectos} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, cursor: 'pointer', color: '#1565c0', padding: '6px 12px', borderRadius: '4px', transition: 'all 0.2s', '&:hover': { textDecoration: 'underline', backgroundColor: 'rgba(21, 101, 192, 0.04)' }}}>
            <FolderOpenIcon sx={{ fontSize: '1.2rem', display: 'block' }} />
            <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem', lineHeight: 1 }}>VER PROYECTOS</Typography>
        </Box>
    );

    // Renderizamos la estructura base pasándole nuestras piezas
    return (
        <CardGeneral 
            id={c.id}
            contenidoPrincipal={principal}
            contenidoExtra={extra}
            acciones={acciones}
        />
    );
}