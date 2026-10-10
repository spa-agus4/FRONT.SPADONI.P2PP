import { Box, Typography } from '@mui/material';

interface Props {
    opciones: { label: string; value: string }[];
    seccionActiva: string;
    colorFranja: string;
    onChange: (value: string) => void;
}

export default function SidebarLayout({ opciones, seccionActiva, colorFranja, onChange }: Props) {
    return (
        <Box sx={{ width: 350, borderRight: '1px solid #ccc', padding: 2 }}>
            {opciones.map(op => (
                <Typography
                    key={op.value}
                    onClick={() => onChange(op.value)}
                    sx={{
                        fontSize: 30,
                        cursor: 'pointer',
                        padding: '8px 0',
                        fontWeight: seccionActiva === op.value ? 'bold' : 'normal',
                        color: seccionActiva === op.value ? colorFranja : '#000',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    {op.label}
                </Typography>
            ))}
        </Box>
    );
}