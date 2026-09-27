import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import SwitchDisponibilidad from '../CustomSwitch';
import CampoTexto from '../CampoTexto';

import CardGeneral from './CardGeneral';
import type { Desarrollador } from '../../../types';

interface Props {
    dev: Desarrollador;
    acciones?: (datos?: Desarrollador) => React.ReactNode;
    editando: boolean;
}

export default function CardDesarrollador({ dev, acciones, editando }: Props) {
    const [nuevoNombre, setNuevoNombre] = useState<string>(dev.nombre);
    const [editHabilidades, setEditHabilidades] = useState<string>(dev.habilidades);
    const [editDisponible, setEditDisponible] = useState<boolean>(dev.disponible);

    const devActualizado: Desarrollador = {
        ...dev,
        nombre: nuevoNombre,
        disponible: editDisponible,
        habilidades: editHabilidades,
        proyecto: dev.proyecto
    };

    useEffect(() => {
        setNuevoNombre(dev.nombre);
        setEditHabilidades(dev.habilidades);
        setEditDisponible(dev.disponible);
    }, [editando, dev]);

    const principal = !editando ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                {dev.nombre}
            </Typography>
            <Typography sx={{ fontSize: '0.9rem' }}>
                {dev.habilidades}
            </Typography>
        </Box>
    ) : (
        <>
            <CampoTexto label="NOMBRE" size="small" variant="outlined" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} maxLength={80} />
            <SwitchDisponibilidad
                valor={editDisponible}
                onChange={setEditDisponible}
                textoIzquierdo="No disponible"
                textoDerecho="Disponible"
            />
            <CampoTexto label="HABILIDADES" size="small" variant="outlined" value={editHabilidades} onChange={e => setEditHabilidades(e.target.value)} maxLength={200} mostrarContador={true} />
        </>
    );

    const extra = !editando ? (
        <>
            <Typography sx={{ color: dev.proyecto != null ? '#f9a825' : dev.disponible ? '#2e7d32' : '#c62828', fontWeight: 'bold', fontSize: '0.95rem' }}>
                {dev.proyecto != null ? '⏱ Actualmente asignado' : dev.disponible ? '✓ Libre para asignar' : '✗ No disponible'}
            </Typography>
            <Typography sx={{ fontSize: '0.9rem', color: '#555' }}>
                {dev.proyecto != null ? `Proyecto: ${dev.proyecto.nombre}` : 'Sin proyecto asignado'}
            </Typography>
        </>
    ) : null;


    return (
        <CardGeneral
            id={dev.id}
            contenidoPrincipal={principal}
            contenidoExtra={extra}
            acciones={acciones ? acciones(devActualizado) : undefined}
        />
    );
}