import { Box, Typography } from '@mui/material';

interface BotonAgregarProps {
    texto: string;
    onClick: () => void;
}

export default function BotonAgregar({ texto, onClick }: BotonAgregarProps) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Typography
                onClick={onClick}
                sx={{
                    color: 'black',
                    fontWeight: 'bold',
                    mt: 3,
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                }}
            >
                {texto}
            </Typography>
        </Box>
    );
}