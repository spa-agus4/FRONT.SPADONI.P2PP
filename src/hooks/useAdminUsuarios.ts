import { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

import type { Usuario, Cliente, CredencialesDTO, UsuarioListadoDTO } from '../types';

import { listarUsuarios, actualizarUsuario, eliminarUsuario, habilitarUsuario } from '../services/usuarioService';

import { validarEdicionUsuario } from '../utils/validations/validarEdicionUsuario';
import { normalizarTexto } from '../utils/textUtils';

import { useModalEliminar } from './useModalEliminar';
import { useVistaFormulario } from './useVistaFormulario';
import { useProcesarError } from './useProcesarError';

export function useAdminUsuarios() {

    const { id, iniciarSesion } = useAuth();
    const { showNotification } = useNotification();
    const { procesarError } = useProcesarError();
    const { open, seleccionado: usuarioSeleccionado, abrirModal: handleAbrirModal, cerrarModal } = useModalEliminar<Usuario>();
    const { vista, abrirParaCrear, volverALista } = useVistaFormulario<Usuario>();

    //const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    const [objUsuariosListados, setObjUsuariosListados] = useState<UsuarioListadoDTO[]>([]);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [nuevoNombreUsuario, setNuevoNombreUsuario] = useState('');
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [mostrarInhabilitados, setMostrarInhabilitados] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [rolFiltro, setRolFiltro] = useState<Usuario['rol'] | 'TODOS'>('TODOS');


    // CARGAR USUARIOS
    useEffect(() => {
        listarUsuarios()
            .then(data => setObjUsuariosListados(data))
            .catch(procesarError);
    }, []);

    // EDITAR USUARIO
    const handleEditar = (usuario: Usuario) => {
        setEditandoId(usuario.id);
        setNuevoNombreUsuario(usuario.nombreUsuario ?? '');
        setNuevaContrasena('');
        setError(null);
    };


    // GUARDAR EDICIÓN
    const handleGuardar = () => {

        setError(null);

        if (editandoId === null) return;

        const original = objUsuariosListados.find(d => d.usuario.id === editandoId);

        if (!original) return;

        const datosParaEnviar: CredencialesDTO = { nombreUsuario: nuevoNombreUsuario };

        if (nuevaContrasena.trim() !== '')
            datosParaEnviar.contrasena = nuevaContrasena;

        const errores = validarEdicionUsuario(nuevoNombreUsuario, nuevaContrasena, original.usuario);

        if (errores.length > 0) {
            setError(errores.join(' | '));
            return;
        }

        const huboCambioNombre = nuevoNombreUsuario !== original.usuario.nombreUsuario;

        const huboCambioContrasena = nuevaContrasena !== '';

        if (!huboCambioNombre && !huboCambioContrasena) {
            showNotification('No se detectaron cambios para actualizar.', 'warning');
            return;
        }

        actualizarUsuario(editandoId, datosParaEnviar)
            .then((respuestaBackend) => {
                const usuarioModificado = respuestaBackend.usuarioDTO;   // # aca está la respuesta

                actualizarUsuarioEditado(usuarioModificado);

                if (id === editandoId && respuestaBackend.token) {
                    iniciarSesion(respuestaBackend.token);
                    showNotification('¡Perfil actualizado con éxito!', 'success');
                } else {
                    showNotification('¡Usuario actualizado con éxito!', 'success');
                }
            })
            .catch(procesarError);
    };

    // CANCELAR EDICIÓN
    const handleCancelarEdicion = () => {
        setEditandoId(null);
        setNuevaContrasena('');
        setNuevoNombreUsuario('');
        setError(null);
    };

    // ACTUALIZAR USUARIO EN LISTA
    const actualizarUsuarioEditado = (usuarioActualizado: UsuarioListadoDTO) => {
        setObjUsuariosListados(prev =>
            prev.map(d =>
                d.usuario.id === usuarioActualizado.usuario.id
                    ? usuarioActualizado
                    : d
            )
        );

        setEditandoId(null);
        setNuevaContrasena('');
        setNuevoNombreUsuario('');
        setError(null);
    };

    // HABILITAR USUARIO
    const handleHabilitar = (usuario: Usuario) => {
        habilitarUsuario(usuario.id)
            .then(() => {
                setObjUsuariosListados(prev =>
                    prev.map(item =>
                        item.usuario.id === usuario.id
                            // Ingresamos a 'usuario' y sobreescribimos 'activo'
                            ? { ...item, usuario: { ...item.usuario, activo: true } }
                            : item
                    )
                );
                showNotification(`Usuario ${usuario.nombreUsuario} habilitado con éxito`, 'success');
            }).catch(procesarError);
    };

    // CONFIRMAR ELIMINACIÓN
    const confirmarEliminar = () => {

        if (!usuarioSeleccionado) { return; }

        eliminarUsuario(usuarioSeleccionado.id).then((respuesta) => {

            if (respuesta && respuesta.usuario.activo === false) {
                setObjUsuariosListados(prev =>
                    prev.map(obj =>
                        obj.usuario.id === usuarioSeleccionado.id
                            // Hacemos exactamente lo mismo acá pero con false
                            ? { ...obj, usuario: { ...obj.usuario, activo: false } }
                            : obj
                    )
                );
                showNotification('El cliente tiene proyectos asociados, fue inhabilitado.', 'warning');
            } else {
                setObjUsuariosListados(prev =>
                    prev.filter(
                        obj =>
                            obj.usuario.id !== usuarioSeleccionado.id
                    )
                );
                showNotification('¡Usuario eliminado con éxito!', 'success');
            }
            cerrarModal();
        }).catch(procesarError);
    };

    // AGREGAR USUARIO CREADO
    const actualizarLista = (usuarioCreado: UsuarioListadoDTO) => {
        volverALista();
        setObjUsuariosListados(prev => [...prev, usuarioCreado]);
    };

    // BOTÓN AGREGAR
    const prepararNuevoUsuario = () => {
        handleCancelarEdicion();
        abrirParaCrear();
    };

    // FILTRAR USUARIOS
    const usuariosVisibles = objUsuariosListados.filter(obj => {

        if (!mostrarInhabilitados && obj.usuario.activo === false)
            return false;

        if (rolFiltro !== 'TODOS' && obj.usuario.rol !== rolFiltro)
            return false;

        const termino = normalizarTexto(busqueda.trim());

        if (termino === '')
            return true;

        const coincideUsuario = normalizarTexto(obj.usuario.nombreUsuario ?? '').includes(termino);

        const coincideNombre = obj.usuario.rol === 'CLIENTE' && normalizarTexto(obj.datosCliente.nombre ?? '').includes(termino);   // # cambiarrr

        return coincideUsuario || coincideNombre;
    });


    return {
        // Datos
        usuariosVisibles,

        // Vista
        vista,
        actualizarLista,
        volverALista,
        prepararNuevoUsuario,

        // Edición
        editandoId,
        nuevoNombreUsuario,
        nuevaContrasena,
        error,

        handleEditar,
        handleGuardar,
        handleCancelarEdicion,

        setNuevoNombreUsuario,
        setNuevaContrasena,

        // Habilitar / eliminar
        handleHabilitar,
        handleAbrirModal,
        confirmarEliminar,

        // Modal
        open,
        usuarioSeleccionado,
        cerrarModal,

        // Filtros
        busqueda,
        setBusqueda,
        mostrarInhabilitados,
        setMostrarInhabilitados,
        rolFiltro,
        setRolFiltro,

        // Usuario logueado
        id
    };
}