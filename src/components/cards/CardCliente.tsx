import { Box, Card, Chip, IconButton, Tooltip, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PhoneIcon from '@mui/icons-material/Phone'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import HomeIcon from '@mui/icons-material/Home'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'

import type { Cliente } from '../../types'

interface Props {
    c: Cliente;
    onEditar: (c: Cliente) => void;
    onEliminar: (c: Cliente) => void;
    onVerProyectos: () => void;
    onHabilitar: (c: Cliente) => void;
}

export default function CardCliente({ c, onEditar, onEliminar, onVerProyectos, onHabilitar }: Props) {

    return (
        <Card sx={{
            display: 'flex',
            '&:not(:first-of-type)': { mt: 1.5 },
            minHeight: 100 // Altura mínima para mantener simetría con los proyectos
        }}>

            {/* ID - columna izquierda gris */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '8%',
                backgroundColor: '#616161',
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#424242' }
            }}
                onClick={() => onEditar(c)}
            >
                <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.3rem' }}>
                    {c.id}
                </Typography>
            </Box>

            {/* INFO PRINCIPAL */}
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', padding: 1.5, gap: 0.5 }}>

                {/* NOMBRE */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#212121' }}>
                        {c.nombre}
                    </Typography>
                    {!c.activo && (
                        <Chip
                            label="Inhabilitado"
                            size="small"
                            sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600, backgroundColor: '#eeeeee', color: '#757575' }}
                        />
                    )}
                </Box>

                {/* TELÉFONO | EMAIL */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>

                    {/* TELÉFONO */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#555' }}>
                        <PhoneIcon sx={{ fontSize: '1.1rem', color: '#757575' }} />
                        <Typography sx={{ fontSize: '0.9rem' }}>
                            {c.telefono || 'Sin teléfono'}
                        </Typography>
                    </Box>

                    {/* EMAIL */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#555' }}>
                        <MailOutlineIcon sx={{ fontSize: '1.1rem', color: '#757575' }} />
                        <Typography sx={{ fontSize: '0.9rem' }}>
                            {c.email}
                        </Typography>
                    </Box>
                </Box>

                {/* DIRECCIÓN */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#555', mt: 0.5 }}>
                    <HomeIcon sx={{ fontSize: '1.1rem', color: '#757575' }} />
                    <Typography sx={{ fontSize: '0.9rem' }}>
                        {c.direccion || 'Sin dirección registrada'}
                    </Typography>
                </Box>
            </Box>

            {/* COLUMNA CENTRAL: BOTÓN VER PROYECTOS */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '32%',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Box
                    onClick={onVerProyectos}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',       // Centrado flex estándar
                        justifyContent: 'center',   // Centra el bloque entero
                        gap: 1,                     // Separación limpia entre icono y texto
                        cursor: 'pointer',
                        color: '#1565c0',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        transition: 'all 0.2s',
                        '&:hover': {
                            textDecoration: 'underline',
                            backgroundColor: 'rgba(21, 101, 192, 0.04)'
                        }
                    }}
                >
                    {/* Usamos el icono con un ajuste fino si es necesario, pero alineado verticalmente */}
                    <FolderOpenIcon sx={{ fontSize: '1.2rem', display: 'block' }} />

                    <Typography sx={{
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        lineHeight: 1,            // <-- No tocar. Esto quita el espacio extra que MUI le mete por defecto abajo a los textos
                        display: 'inline-flex',
                        alignItems: 'center'
                    }}>
                        VER PROYECTOS
                    </Typography>
                </Box>
            </Box>

            {/* ACCIONES (Editar y Eliminar fijos en el lateral derecho) */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '10%',
                justifyContent: 'center',
                alignItems: 'center',
                borderLeft: '1px solid #eee',
                gap: 0.5
            }}>
                <IconButton
                    size="small"
                    sx={{
                        color: '#424242',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        }
                    }}
                    onClick={() => onEditar(c)}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
                {c.activo ? (
                    <IconButton size="small" sx={{ color: '#424242', '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.08)', color: '#d32f2f' } }} onClick={() => onEliminar(c)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                ) : (
                    <Tooltip title="Habilitar cliente">
                        <IconButton size="small" sx={{ color: '#2e7d32', '&:hover': { backgroundColor: 'rgba(46, 125, 50, 0.08)' } }} onClick={() => onHabilitar(c)}>

                            <LockOpenIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}

            </Box>
        </Card>
    );
}