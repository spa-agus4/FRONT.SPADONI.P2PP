import { Box, FormControl, MenuItem, Select, TextField, Typography } from "@mui/material";
import { ETAPAS, type EstadoProyecto, type ProyectoDatosDTO } from "../../../types";

interface Props {
    canalSolicitud: ProyectoDatosDTO['canalSolicitud']
    presupuesto: number
    estadoProyecto: EstadoProyecto
    onChangeCanal: (canalSolicitud: ProyectoDatosDTO['canalSolicitud']) => void
    onChangePresupuesto: (presupuesto: number) => void
    onChangeEstado: (estado: EstadoProyecto) => void
    esLecturaOnly: boolean
}

function DatosAdministrativosProyecto({ canalSolicitud, presupuesto, estadoProyecto, onChangeCanal, onChangePresupuesto, onChangeEstado, esLecturaOnly }: Props) {

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }} >
                <Typography sx={{ fontWeight: '500' }}>CANAL SOLICITUD:</Typography>
                {esLecturaOnly ? (
                    <Typography sx={{ color: '#333' }}>{canalSolicitud || "Sin especificar"}</Typography>
                ) : (
                    <FormControl sx={{ maxWidth: 500, minWidth: 120 }}>
                        <Select variant="standard" value={canalSolicitud} onChange={(e) => onChangeCanal(e.target.value as ProyectoDatosDTO['canalSolicitud'])}>
                            <MenuItem value="EMAIL">Email</MenuItem>
                            <MenuItem value="TELEFONO">Teléfono</MenuItem>
                            <MenuItem value="PRESENCIAL">Presencial</MenuItem>
                        </Select>
                    </FormControl>
                )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }} >
                <Typography sx={{ fontWeight: '500' }}>PRESUPUESTO:</Typography>
                {esLecturaOnly ? (
                    <Typography sx={{ color: '#333' }}>
                        {presupuesto ? `$${presupuesto.toLocaleString()}` : "$0"}
                    </Typography>
                ) : (
                    <TextField variant="standard" type="number" value={presupuesto === 0 ? "" : presupuesto} onChange={(e) => onChangePresupuesto(Number(e.target.value))} />
                )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontWeight: '500' }}>ETAPA:</Typography>
                {esLecturaOnly ? (
                    <Typography sx={{ color: '#333' }}>{ETAPAS[estadoProyecto]}</Typography>
                ) : (
                    <FormControl sx={{ minWidth: 180 }}>
                        <Select variant="standard" value={estadoProyecto} onChange={(e) => onChangeEstado(e.target.value as EstadoProyecto)}>
                            {Object.entries(ETAPAS).map(([valor, label]) => (
                                <MenuItem key={valor} value={valor}>{label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </Box>
        </Box>
    );
}

export default DatosAdministrativosProyecto;