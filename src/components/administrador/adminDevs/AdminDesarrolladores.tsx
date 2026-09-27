import BarraBusqueda from '../../shared/BarraFiltros/BarraBusqueda';
import SelectFiltro from '../../shared/BarraFiltros/Filtros/SelectFiltro';
import CardDesarrollador from '../../shared/cards/CardDesarrollador';
import { Box, Alert } from '@mui/material';
import FormularioDesarrollador from './FormularioDesarrollador';
import ModalEliminar from '../../shared/Modales/ModalEliminar';
import BotonAgregar from '../../shared/botones/BotonAgregar';
import ContenedorScroll from '../../shared/ContenedorScroll';
import { BotonEliminar } from '../../shared/botones/iconButtons/BotonEliminar';
import { BotonEditar } from '../../shared/botones/iconButtons/BotonEditar';
import { BotonCheck } from '../../shared/botones/iconButtons/BotonCheck';
import { BotonCancelar } from '../../shared/botones/iconButtons/BotonCancelar';
import { useAdminDesarrolladores } from '../../../hooks/useAdminDesarrolladores';

function AdminDesarrolladores() {
    const {
        desarrolladores,
        desarrolladoresVisibles,
        editandoId,
        error,
        busqueda,
        filtroDisponibilidad,
        open,
        devSeleccionado,
        vista,
        setEditandoId,
        setError,
        setBusqueda,
        setFiltroDisponibilidad,
        handleAbrirModal,
        cerrarModal,
        abrirParaCrear,
        volverALista,
        handleGuardar,
        confirmarEliminar,
        actualizarLista
    } = useAdminDesarrolladores();

    return (
        <Box>
            {vista === 'lista' ? (
                <>
                    <BarraBusqueda
                        busqueda={busqueda}
                        onBusquedaChange={setBusqueda}
                        placeholder="Buscar desarrollador por nombre"
                    >
                        <SelectFiltro
                            value={filtroDisponibilidad}
                            onChange={setFiltroDisponibilidad}
                            opciones={[
                                { valor: 'TODOS', etiqueta: 'Todos' },
                                { valor: 'DISPONIBLE', etiqueta: 'Disponible' },
                                { valor: 'OCUPADO', etiqueta: 'Ocupado' },
                                { valor: 'NO DISPONIBLE', etiqueta: 'No disponible' }
                            ]}
                        />
                    </BarraBusqueda>

                    <ContenedorScroll alturaMaxima={370}>
                        {desarrolladoresVisibles.length > 0 ? (
                            desarrolladoresVisibles.map((dev) => (
                                <Box key={dev.id} sx={{ mb: 2 }}>
                                    {error && editandoId === dev.id && (
                                        <Alert
                                            severity="error"
                                            sx={{
                                                mb: 1,
                                                border: '1px solid #d32f2f',
                                                borderRadius: '5px'
                                            }}
                                        >
                                            {error}
                                        </Alert>
                                    )}

                                    <CardDesarrollador
                                        dev={dev}
                                        editando={editandoId === dev.id}
                                        acciones={(datosDelHijo) => (
                                            <>
                                                {editandoId === dev.id ? (
                                                    <>
                                                        <BotonCheck
                                                            onClick={() => handleGuardar(datosDelHijo!)}
                                                            tooltipPlacement='top' 
                                                        />
                                                        <BotonCancelar
                                                            onClick={() => {
                                                                setEditandoId(null);
                                                                setError(null);
                                                            }}
                                                            tooltipPlacement='bottom'
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <BotonEditar
                                                            onClick={() => {
                                                                setEditandoId(dev.id);
                                                                setError(null);
                                                            }}
                                                        />
                                                        <BotonEliminar onClick={() => handleAbrirModal(dev)} />
                                                    </>
                                                )}
                                            </>
                                        )}
                                    />
                                </Box>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
                                {desarrolladores.length === 0
                                    ? "No hay desarrolladores cargados actualmente."
                                    : "No se encontraron desarrolladores con ese criterio."}
                            </p>
                        )}

                        <ModalEliminar
                            open={open}
                            onClose={cerrarModal}
                            mensaje={<>¿Estás seguro de que deseás eliminar al desarrollador <strong>{devSeleccionado?.nombre}</strong>?</>}
                            onConfirmar={confirmarEliminar}
                        />
                    </ContenedorScroll>

                    <BotonAgregar
                        texto="Agregar Desarrollador..."
                        onClick={() => abrirParaCrear()}
                    />
                </>
            ) : (
                <FormularioDesarrollador
                    onGuardar={actualizarLista}
                    onCancelar={volverALista}
                />
            )}
        </Box>
    );
}

export default AdminDesarrolladores;