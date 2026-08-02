import { Box, Card, TextField, Typography } from '@mui/material'
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import type { Desarrollador } from '../../types'
import { useEffect, useState } from 'react'
import SwitchDisponibilidad from '../shared/CustomSwitch'
import CampoTexto from '../shared/CampoTexto';

interface Props {
    dev: Desarrollador
    acciones?: (datos?: Desarrollador) => React.ReactNode
    editando: boolean
}

export default function CardDesarrollador({ dev, acciones, editando }: Props) {

    const [nuevoNombre, setNuevoNombre] = useState<string>(dev.nombre)
    const [editHabilidades, setEditHabilidades] = useState<string>(dev.habilidades)
    const [editDisponible, setEditDisponible] = useState<boolean>(dev.disponible)
    const devActualizado: Desarrollador = {
        ...dev, // Mantener ID y otros datos
        nombre: nuevoNombre,
        disponible: editDisponible,
        habilidades: editHabilidades,
        proyecto: dev.proyecto // o null para resetearlo
    };

    useEffect(() => {

        setNuevoNombre(dev.nombre)
        setEditHabilidades(dev.habilidades)
        setEditDisponible(dev.disponible)

    }, [editando, dev]);

    return (
        <Card sx={{
            display: 'flex',
            '&:not(:first-of-type)': { mt: 1.5 }  // margen solo entre cards, no en la primera
        }}>
            {/* ID */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '8%',
                backgroundColor: '#616161',
            }}>
                <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.3rem' }}>
                    {dev.id}
                </Typography>
            </Box>

            {/* Datos principales */}
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '82%', padding: 1.5, gap: 0.5 }}>
                {!editando ? (
                    <>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                            {dev.nombre}
                        </Typography>
                        <Typography sx={{ color: dev.proyecto != null ? '#f9a825' : dev.disponible ? '#2e7d32' : '#c62828', fontWeight: 'bold', fontSize: '0.95rem' }}>
                            {dev.proyecto != null ? (
                                <> ⏱ Actualmente asignado </>
                            ) : dev.disponible ? (
                                <>✓ Libre para asignar</>
                            ) : (
                                <>✗ No disponible</>
                            )}
                        </Typography>

                        <Typography sx={{ fontSize: '0.9rem', color: '#555' }}>
                            {dev.proyecto != null ? `Proyecto: ${dev.proyecto.nombre}` : 'Sin proyecto asignado'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.9rem' }}>
                            {dev.habilidades}
                        </Typography>
                    </>

                ) : (
                    <>
                        <CampoTexto label="NOMBRE" size="small" variant="outlined" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} maxLength={80}></CampoTexto>

                        <SwitchDisponibilidad
                            valor={editDisponible}
                            onChange={setEditDisponible}
                            textoIzquierdo="No disponible"
                            textoDerecho="Disponible"
                        />

                        <CampoTexto label="HABILIDADES" size="small" variant="outlined" value={editHabilidades} onChange={e => setEditHabilidades(e.target.value)} maxLength={200} mostrarContador={true}></CampoTexto>
                    </>
                )}

            </Box>

            {/* Botones */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '10%',
                gap: 1
            }}>
                {acciones && acciones(devActualizado)}
            </Box>
        </Card>
    )
}