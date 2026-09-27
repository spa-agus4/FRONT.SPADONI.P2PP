import { Box, Divider, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import FormularioUsuario from './FormularioUsuario';

import BarraBusqueda from '../../shared/BarraFiltros/BarraBusqueda';
import CheckboxFiltro from '../../shared/BarraFiltros/Filtros/CheckboxFiltro';
import SelectFiltro from '../../shared/BarraFiltros/Filtros/SelectFiltro';
import BotonAgregar from '../../shared/botones/BotonAgregar';
import ContenedorScroll from '../../shared/ContenedorScroll';
import ModalEliminar from '../../shared/Modales/ModalEliminar';

import FilaUsuario from './listaUsuarios/FilaUsuario';
import { useAdminUsuarios } from '../../../hooks/useAdminUsuarios';


function AdminUsuarios() {

    const {
        usuariosVisibles,

        vista,
        actualizarLista,
        volverALista,
        prepararNuevoUsuario,

        editandoId,
        nuevoNombreUsuario,
        nuevaContrasena,
        error,

        handleEditar,
        handleGuardar,
        handleCancelarEdicion,

        setNuevoNombreUsuario,
        setNuevaContrasena,

        handleHabilitar,
        handleAbrirModal,
        confirmarEliminar,

        open,
        usuarioSeleccionado,
        cerrarModal,

        busqueda,
        setBusqueda,
        mostrarInhabilitados,
        setMostrarInhabilitados,
        rolFiltro,
        setRolFiltro,

        id
    } = useAdminUsuarios();


    return (
        <Box>

            {vista === 'lista' ? (

                <>
                    <ContenedorScroll alturaMaxima={370}>

                        <Table stickyHeader>

                            <TableHead>
                                <TableRow>
                                    {['ID', 'ROL', 'USUARIO', 'CONTRASEÑA', 'ACCIONES'].map((head) => (
                                        <TableCell
                                            key={head}
                                            align={
                                                head === 'ACCIONES'
                                                    ? 'center'
                                                    : 'left'
                                            }
                                            sx={{
                                                fontWeight: 'bold',
                                                fontSize: '1.2rem',
                                                backgroundColor: '#e0e0e0',
                                                color: 'black',
                                                borderBottom:
                                                    '2px solid #808080'
                                            }}
                                        >
                                            {head}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {usuariosVisibles.map(usuarioListado => (
                                    <FilaUsuario
                                        key={usuarioListado.usuario.id}
                                        usuarioListado={usuarioListado}
                                        editando={editandoId === usuarioListado.usuario.id}
                                        nombreUsuario={nuevoNombreUsuario}
                                        nuevaContrasena={nuevaContrasena}
                                        error={error}
                                        esUsuarioLogueado={usuarioListado.usuario.id === id}
                                        onEditar={() => handleEditar(usuarioListado.usuario)}
                                        onGuardar={handleGuardar}
                                        onCancelar={handleCancelarEdicion}
                                        onHabilitar={() => handleHabilitar(usuarioListado.usuario)}
                                        onEliminar={() => handleAbrirModal(usuarioListado.usuario)}
                                        onNombreUsuarioChange={setNuevoNombreUsuario}
                                        onContrasenaChange={setNuevaContrasena}
                                    />
                                ))}
                            </TableBody>
                        </Table>

                        <ModalEliminar
                            open={open}
                            onClose={cerrarModal}
                            mensaje={
                                <>
                                    ¿Estás seguro de que deseás eliminar al usuario{' '}<strong>{usuarioSeleccionado?.nombreUsuario}</strong>{' '}
                                    con el rol{' '}<strong>{usuarioSeleccionado?.rol}</strong>?
                                </>}
                            onConfirmar={confirmarEliminar}
                        />
                    </ContenedorScroll>


                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mt: 2, flexWrap: 'wrap', gap: 2 }}>

                        <BarraBusqueda
                            busqueda={busqueda}
                            onBusquedaChange={setBusqueda}
                            placeholder="Buscar por usuario o nombre de cliente"
                            backgroundColor="#e0e0e0"
                            borderColor="#acacac"
                            maxWidth={690}
                        >
                            <CheckboxFiltro
                                checked={mostrarInhabilitados}
                                onChange={setMostrarInhabilitados}
                                label="Mostrar inhabilitados"
                            />

                            <Divider
                                orientation="vertical"
                                flexItem
                                sx={{ my: 0.5 }}
                            />

                            <SelectFiltro
                                value={rolFiltro}
                                onChange={setRolFiltro}
                                opciones={[
                                    {valor: 'TODOS', etiqueta: 'Todos los roles'},
                                    {valor: 'CLIENTE', etiqueta: 'Cliente'},
                                    {valor: 'GERENTE', etiqueta: 'Gerente'},
                                    {valor: 'ADMINISTRADOR', etiqueta: 'Administrador'}
                                ]}
                            />
                        </BarraBusqueda>

                        <Box sx={{ mt: '0 !important' }}>
                            <BotonAgregar
                                texto="Agregar Usuario..."
                                onClick={prepararNuevoUsuario}
                            />
                        </Box>
                    </Box>
                </>

            ) : (

                <FormularioUsuario
                    onGuardar={actualizarLista}
                    onCancelar={volverALista}
                />

            )}
        </Box>
    );
}

export default AdminUsuarios;