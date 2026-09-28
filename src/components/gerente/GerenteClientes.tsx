import ContenedorScroll from '../shared/ContenedorScroll';
import BarraBusqueda from '../shared/BarraFiltros/BarraBusqueda';
import CheckboxFiltro from '../shared/BarraFiltros/Filtros/CheckboxFiltro';
import CardCliente from '../shared/cards/CardCliente';
import FormularioCliente from './FormularioCliente';
import { Box, Typography } from '@mui/material';
import ModalEliminar from '../shared/Modales/ModalEliminar';
import BotonAgregar from '../shared/botones/BotonAgregar';
import { BotonEditar } from '../shared/botones/iconButtons/BotonEditar';
import { BotonEliminar } from '../shared/botones/iconButtons/BotonEliminar';
import { BotonHabilitar } from '../shared/botones/iconButtons/BotonHabilitar';
import { useGerenteCliente } from '../../hooks/useGerenteCliente';


interface GerenteClientesProps {
    onVerProyectosCliente: (id: number) => void;    // esto es para recibir el ID de un cliente (desde otra vista) y filtrar sus proyectos en esta vista
}

function GerenteClientes({ onVerProyectosCliente }: GerenteClientesProps) {

    const {
        clientes,
        busqueda,
        ocultarInhabilitados,
        clientesFiltrados,
        open,
        clienteSeleccionado,
        vista,
        itemAEditar,
        setBusqueda,
        setOcultarInhabilitados,
        handleAbrirModal,
        cerrarModal,
        abrirParaCrear,
        abrirParaEditar,
        volverALista,
        confirmarEliminar,
        handleHabilitar,
        handleGuardarFormulario
    } = useGerenteCliente();

    return (
        <Box>
            {vista === 'lista' ? (
                <>
                    <BarraBusqueda
                        busqueda={busqueda}
                        onBusquedaChange={setBusqueda}
                        placeholder="Buscar cliente por nombre o email"
                        maxWidth={580}
                    >
                        <CheckboxFiltro
                            checked={ocultarInhabilitados}
                            onChange={setOcultarInhabilitados}
                            label="Ocultar inhabilitados"
                        />
                    </BarraBusqueda>

                    <ContenedorScroll alturaMaxima={370}>

                        {clientesFiltrados.length > 0 ? (
                            clientesFiltrados.map((c) => (
                                <Box key={c.id} sx={{ mb: 2 }}>
                                    <CardCliente
                                        c={c}
                                        onVerProyectos={() => onVerProyectosCliente(c.id)}
                                        acciones={
                                            <>
                                                <BotonEditar onClick={() => abrirParaEditar(c)} />
                                                {
                                                    !c.activo && c.nombreUsuario != null ? (
                                                        <BotonHabilitar onClick={() => handleHabilitar(c)} />
                                                    ) : (
                                                        <BotonEliminar onClick={() => handleAbrirModal(c)} />
                                                    )
                                                }
                                            </>
                                        }
                                    />
                                </Box>
                            ))
                        ) : (
                            <Typography sx={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
                                {clientes.length === 0
                                    ? "No hay clientes cargados actualmente."
                                    : "No se encontraron clientes con ese criterio."}
                            </Typography>
                        )}

                        <ModalEliminar
                            open={open}
                            onClose={cerrarModal}
                            mensaje={<>¿Estás seguro de que deseás eliminar al cliente <strong>{clienteSeleccionado?.nombre}</strong>?</>}
                            onConfirmar={confirmarEliminar}
                        />

                    </ContenedorScroll>

                    <BotonAgregar texto="Agregar Cliente..." onClick={abrirParaCrear} />
                </>
            ) : (
                <FormularioCliente
                    clienteAEditar={itemAEditar}
                    onGuardar={handleGuardarFormulario}
                    onCancelar={volverALista}
                    onEliminar={confirmarEliminar}
                />
            )}
        </Box>
    );
}

export default GerenteClientes;