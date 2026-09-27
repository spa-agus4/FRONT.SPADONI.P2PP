/*import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';

export interface BotonAccionProps {
    onClick: () => void;
}

export function BotonEditar({ onClick }: BotonAccionProps) {
    return (
        <Tooltip title="Editar" placement="top">
            <IconButton
                size="small"
                sx={{ color: '#424242', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                onClick={onClick}
            >
                <EditIcon fontSize="small" />
            </IconButton>
        </Tooltip>

    );
}

export function BotonEliminar({ onClick }: BotonAccionProps) {
    return (
        <Tooltip title="Eliminar">

            <IconButton
                size="small"
                sx={{ color: '#424242', '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.08)', color: '#d32f2f' } }}
                onClick={onClick}
            >
                <DeleteIcon fontSize="small" />
            </IconButton>
        </Tooltip>

    );
}

export function BotonHabilitar({ onClick }: BotonAccionProps) {
    return (
        <Tooltip title="Habilitar cliente">
            <IconButton
                size="small"
                sx={{ color: '#2e7d32', '&:hover': { backgroundColor: 'rgba(46, 125, 50, 0.08)' } }}
                onClick={onClick}
            >
                <LockOpenIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    );
}

export function BotonVisualizar({ onClick }: BotonAccionProps) {
    return (
        <Tooltip title="Ver detalles">
            <IconButton
                size="small"
                sx={{ color: '#424242', '&:hover': { backgroundColor: 'rgba(47, 173, 211, 0.08)', color: '#2fadd3' } }}
                onClick={onClick}
            >
                <VisibilityIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    );
}*/