import BarraBusqueda from '../shared/BarraFiltros/BarraBusqueda';
import SelectFiltro from '../shared/BarraFiltros/Filtros/SelectFiltro';
import CardProyecto from '../shared/cards/CardProyecto';
import FormularioProyecto from './FormularioProyecto';
import { Box, Typography } from '@mui/material';
import ModalEliminar from '../shared/Modales/ModalEliminar';
import BotonAgregar from '../shared/botones/BotonAgregar';
import ContenedorScroll from '../shared/ContenedorScroll';
import { BotonEditar } from '../shared/botones/iconButtons/BotonEditar';
import { BotonEliminar } from '../shared/botones/iconButtons/BotonEliminar';
import { useGerenteProyecto } from '../../hooks/useGerenteProyecto';


interface GerenteProyectosProps {
    filtroInicial?: number | 'TODOS';
}

function GerenteProyectos({ filtroInicial = 'TODOS' }: GerenteProyectosProps) {

    const {
        busqueda,
        estadoFiltro,
        proyectosFiltrados,
        open,
        proyectoSeleccionado,
        vista,
        itemAEditar,
        setBusqueda,
        setEstadoFiltro,
        setProyectos,
        handleAbrirModal,
        cerrarModal,
        abrirParaCrear,
        abrirParaEditar,
        volverALista,
        confirmarEliminar,
        handleGuardarFormulario
    } = useGerenteProyecto({ filtroInicial });

    return (
        <Box>
            {vista === 'lista' ? (
                <>
                    <BarraBusqueda
                        busqueda={busqueda}
                        onBusquedaChange={setBusqueda}
                        placeholder="Buscar proyecto o cliente"
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
                                <Box key={p.id} sx={{ mb: 2 }}>
                                    <CardProyecto
                                        p={p}
                                        acciones={
                                            <>
                                                <BotonEditar onClick={() => abrirParaEditar(p)} />
                                                <BotonEliminar onClick={() => handleAbrirModal(p)} />
                                            </>
                                        }
                                    />
                                </Box>
                            ))
                        ) : (
                            <Typography sx={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
                                No hay proyectos cargados para el criterio seleccionado.
                            </Typography>
                        )}

                        <ModalEliminar
                            open={open}
                            onClose={cerrarModal}
                            mensaje={<>¿Estás seguro de que deseás eliminar el proyecto <strong>{proyectoSeleccionado?.nombre}</strong>?</>}
                            onConfirmar={confirmarEliminar}
                        />
                    </ContenedorScroll>

                    <BotonAgregar texto="Agregar Proyecto..." onClick={abrirParaCrear} />
                </>
            ) : (
                <FormularioProyecto
                    proyectoAEditar={itemAEditar}
                    onGuardar={handleGuardarFormulario}
                    onCancelar={volverALista}
                    onEliminar={(id) => {
                        setProyectos(prev => prev.filter(p => p.id !== id));
                        volverALista();
                    }}
                />
            )}
        </Box>
    );
}

export default GerenteProyectos;