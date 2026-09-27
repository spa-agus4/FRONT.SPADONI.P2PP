import BarraBusqueda from '../shared/BarraFiltros/BarraBusqueda';
import CardProyecto from '../shared/cards/CardProyecto';
import FormularioProyecto from '../gerente/FormularioProyecto';

import { Box, Typography} from '@mui/material';
import SelectFiltro from '../shared/BarraFiltros/Filtros/SelectFiltro';
import ContenedorScroll from '../shared/ContenedorScroll';
import { BotonVisualizar } from '../shared/botones/iconButtons/BotonVisualizar';
import { useClienteProyectos } from '../../hooks/useClienteProyecto';

function ClienteProyectos() {

    const {
        cargando,
        busqueda,
        estadoFiltro,
        proyectosFiltrados,
        vista,
        proyectoAVer,
        setBusqueda,
        setEstadoFiltro,
        handleAbrirDetalle,
        volverALista
    } = useClienteProyectos();

    return (
        <Box sx={{ width: '100%', pt: 1 }}>
            {vista === 'lista' ? (
                <>
                    <BarraBusqueda
                        busqueda={busqueda}
                        onBusquedaChange={setBusqueda}
                        placeholder="Buscar proyecto por nombre"
                        maxWidth={580}
                    >
                        <SelectFiltro
                            value={estadoFiltro}
                            onChange={setEstadoFiltro}
                            opciones={[
                                { valor: 'TODOS', etiqueta: 'Todos los proyectos' },
                                { valor: 'EN_CURSO', etiqueta: 'En curso' },
                                { valor: 'COMPLETADO', etiqueta: 'Completados' },
                                { valor: 'CANCELADO', etiqueta: 'Cancelados' }
                            ]}
                        />
                    </BarraBusqueda>

                    <ContenedorScroll alturaMaxima={370}>
                        {proyectosFiltrados.length > 0 ? (
                            proyectosFiltrados.map((p) => (
                                <Box key={p.id} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <CardProyecto
                                            p={p}
                                            acciones={<BotonVisualizar onClick={() => handleAbrirDetalle(p)} />}
                                        />
                                    </Box>
                                </Box>
                            ))
                        ) : (
                            <Typography sx={{ textAlign: 'center', color: '#666', marginTop: '60px' }}>
                                {cargando
                                    ? "Cargando tus proyectos..."
                                    : busqueda || estadoFiltro !== 'TODOS'
                                        ? "No se encontraron proyectos con los filtros aplicados."
                                        : "Actualmente no tenés proyectos asignados."
                                }
                            </Typography>
                        )}
                    </ContenedorScroll>
                </>
            ) : (
                <FormularioProyecto
                    proyectoAEditar={proyectoAVer}
                    onGuardar={() => { }} // No hace nada en modo lectura
                    onCancelar={volverALista}
                    esLecturaOnly={true} // Forzamos el modo solo lectura
                />
            )}
        </Box>
    );
}

export default ClienteProyectos;