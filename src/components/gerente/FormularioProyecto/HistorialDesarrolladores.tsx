import { Box, Typography } from "@mui/material"
import type { Desarrollador } from "../../../types/desarrollador"

interface Props {
    desarrolladores: Desarrollador[]
}

function HistorialDesarrolladores({ desarrolladores }: Props) {

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                alignSelf: 'flex-start',
                gap: 1.5,
                width: '80%'
            }}
        >
            <Typography sx={{ fontWeight: '500' }}>
                HISTORIAL DE DESARROLLADORES:
            </Typography>

            {desarrolladores.length > 0 ? (
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 450,
                        maxHeight: '120px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        padding: '4px 2px',
                        '&::-webkit-scrollbar': { width: '5px' },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#ccc',
                            borderRadius: '4px'
                        }
                    }}
                >
                    {desarrolladores.map((dev) => (
                        <Box
                            key={dev.id}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: '#f5f5f5',
                                border: '1px solid #e0e0e0',
                                borderRadius: '4px',
                                padding: '6px 10px'
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: '500', color: '#333' }}
                                >
                                    {dev.nombre}
                                </Typography>

                                {dev.habilidades && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {Array.isArray(dev.habilidades)
                                            ? dev.habilidades.join(', ')
                                            : dev.habilidades}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Typography variant="body2" color="text.secondary">
                    Sin desarrolladores registrados en el historial
                </Typography>
            )}
        </Box>
    )
}

export default HistorialDesarrolladores