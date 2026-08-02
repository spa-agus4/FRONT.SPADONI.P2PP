import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

interface Props {
    message: string;
    severity: "success" | "error" | "info" | "warning";
    onClose: () => void;
}

const config = {
    success: {
        color: '#2e7d32',
        icon: <CheckCircleIcon sx={{ color: '#fff' }} />,
    },
    error: {
        color: '#d32f2f',
        icon: <ErrorIcon sx={{ color: '#fff' }} />,
    },
    warning: {
        color: '#ed6c02',
        icon: <WarningIcon sx={{ color: '#fff' }} />,
    },
    info: {
        color: '#0288d1',
        icon: <InfoIcon sx={{ color: '#fff' }} />,
    },
};

export default function Notification({ message, severity, onClose }: Props) {

    const currentConfig = config[severity];

    return (
        <Box
            onClick={onClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                // Colores sólidos según el estilo de tu web
                backgroundColor: currentConfig.color,
                border: '2px solid #fff',
                borderRadius: '5px',
                padding: '4px 15px',
                cursor: 'pointer',
                animation: 'fadeInRight 0.4s ease-out',
                '@keyframes fadeInRight': {
                    '0%': { opacity: 0, transform: 'translateX(30px)' },
                    '100%': { opacity: 1, transform: 'translateX(0)' }
                },
                '&:hover': {
                    filter: 'brightness(0.9)',
                }
            }}
        >

            {/* Ícono dinámico */}
            {currentConfig.icon}
            <Typography sx={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                {message}
            </Typography>
            <Typography sx={{ color: '#fff', fontSize: 11, ml: 1, opacity: 0.7 }}>
                (cerrar)
            </Typography>
        </Box>
    );
}