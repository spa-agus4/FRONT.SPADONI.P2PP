import { Box, Typography } from '@mui/material';
import Notification from '../shared/Notification';
import { useNotification } from '../../context/NotificationContext';

interface Props {
    nombreUsuario: string;
    colorFranja: string;
    onLogout: () => void;
}

export default function HeaderLayout({ nombreUsuario, colorFranja, onLogout }: Props) {
    const { open, message, severity, setOpen } = useNotification();

    return (
        <>
            <Box sx={{ backgroundColor: '#000', padding: 4 }}>
                <Typography variant="h2" sx={{ color: '#fff', fontWeight: 'bold' }}>
                    Buen Programador
                </Typography>
            </Box>

            <Box sx={{
                backgroundColor: colorFranja,
                padding: '8px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                minHeight: '60px'
            }}>
                <Typography sx={{ color: '#000', fontSize: 25 }}>
                    Ingresó como el usuario: {nombreUsuario}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {open ? (
                        <Notification
                            message={message}
                            severity={severity}
                            onClose={() => setOpen(false)}
                        />
                    ) : (
                        <Typography
                            onClick={onLogout}
                            sx={{
                                fontSize: 25,
                                color: '#000',
                                cursor: 'pointer',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            Salir
                        </Typography>
                    )}
                </Box>
            </Box>
        </>
    );
}