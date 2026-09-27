import { Autocomplete, Box, TextField, Typography } from "@mui/material"
import type { Desarrollador } from "../../../types/desarrollador"
import { normalizarTexto } from "../../../utils/textUtils"

interface Props {
    desarrolladoresDisponibles: Desarrollador[]
    desarrolladoresSeleccionados: Desarrollador[]
    onChange: (desarrolladores: Desarrollador[]) => void
    esLecturaOnly: boolean
}

function SelectorDesarrolladores({ desarrolladoresDisponibles, desarrolladoresSeleccionados, onChange, esLecturaOnly }: Props) {

    // --- FILTRADO EN MEMORIA --- (filtro de devs por nombre o habilidad)
    const filtrarDevs = (opciones: Desarrollador[], { inputValue }: { inputValue: string }) => {
        const termino = normalizarTexto(inputValue.trim());
        if (termino === '') return opciones;
        return opciones.filter(dev =>
            normalizarTexto(dev.nombre).includes(termino) ||
            normalizarTexto(dev.habilidades ?? '').includes(termino)
        );
    };

    return (

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', alignSelf: 'flex-start', gap: 1.5, width: '80%' }}>
            <Typography sx={{ fontWeight: '500' }}>DESARROLLADORES:</Typography>

            {!esLecturaOnly && (
                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    blurOnSelect={false}
                    options={desarrolladoresDisponibles}
                    filterOptions={filtrarDevs}
                    getOptionLabel={(option) => option.nombre || ""}
                    value={desarrolladoresSeleccionados}
                    onChange={(event, newValue) => onChange(newValue)}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderTags={() => null}
                    renderOption={(props, option) => {
                        const { key, ...optionProps } = props;
                        return (
                            <Box key={key} component="li" {...optionProps} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 0.5 }}>
                                <Typography variant="body1" sx={{ fontWeight: '500' }}>{option.nombre}</Typography>
                                {option.habilidades && (
                                    <Typography variant="caption" color="text.secondary">
                                        {Array.isArray(option.habilidades) ? option.habilidades.join(', ') : option.habilidades}
                                    </Typography>
                                )}
                            </Box>
                        );
                    }}
                    renderInput={(params) => <TextField {...params} variant="standard" placeholder="SELECCIONAR DEVS..." />}
                    sx={{ width: '100%', maxWidth: 450 }}
                />
            )}

            {desarrolladoresSeleccionados.length > 0 ? (
                <Box sx={{
                    width: '100%', maxWidth: 450, maxHeight: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1, padding: '4px 2px',
                    '&::-webkit-scrollbar': { width: '5px' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '4px' }
                }}>
                    {desarrolladoresSeleccionados.map((dev) => (
                        <Box key={dev.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '6px 10px' }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: '500', color: '#333' }}>{dev.nombre}</Typography>
                                <Typography variant="caption" color="text.secondary">{dev.habilidades}</Typography>
                            </Box>
                            {!esLecturaOnly && (
                                <Typography onClick={() => onChange(desarrolladoresSeleccionados.filter(d => d.id !== dev.id))} sx={{ cursor: 'pointer', color: '#999', fontWeight: 'bold', fontSize: '14px', '&:hover': { color: '#d32f2f' }, px: 1 }}>✕</Typography>
                            )}
                        </Box>
                    ))}
                </Box>
            ) : (
                esLecturaOnly && <Typography variant="body2" color="text.secondary">Sin desarrolladores asignados</Typography>
            )}
        </Box>
    )
}

export default SelectorDesarrolladores;