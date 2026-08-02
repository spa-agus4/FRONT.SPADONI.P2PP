import { useState } from "react"
import type { Usuario, UsuarioAltaDTO } from "../../types"
import { useAuth } from '../../context/AuthContext'
import { actualizarUsuario, crearUsuario } from '../../services/usuarioService'
import { useNotification } from '../../context/NotificationContext';
import { traducirError } from '../../utils/errorManager';

import { TextField, Typography, Divider, MenuItem, Select, FormControl, Box, InputLabel, Alert } from '@mui/material'
import CampoTexto from "../shared/CampoTexto";

interface Props {
    usuario: Usuario | null
    onGuardar: (usuario: Usuario) => void
    onCancelar: () => void
}

function FormularioUsuario({ usuario, onGuardar, onCancelar }: Props) {
    const [nombreUsuario, setNombreUsuario] = useState(usuario?.nombreUsuario ?? '')
    const [contrasena, setContrasena] = useState('')
    const [rol, setRol] = useState(usuario?.rol ?? 'GERENTE')
    const { token, id, iniciarSesion } = useAuth()
    const { showNotification } = useNotification();
    const [error, setError] = useState<string | null>(null);

    const procesarError = (err: any) => {
        console.error(err);
        const msg = traducirError(err);
        showNotification(msg, 'error');
        //setError(msg);
    };

    const handleGuardar = () => {

        setError(null); // Limpiamos errores previos
        const errores: string[] = [];

        // Validar Nombre de Usuario
        if (nombreUsuario.trim().length < 3) {
            errores.push("El nombre de usuario debe tener al menos 3 caracteres.");
        }
        if (nombreUsuario.includes(" ")) {
            errores.push("El nombre de usuario no puede contener espacios.");
        }

        // Validar Contraseña
        if (!usuario) {
            // Caso: Crear Usuario (Obligatoria)
            if (contrasena.length < 4) {
                errores.push("La contraseña es obligatoria y debe tener al menos 4 caracteres.");
            }
        } else {
            // Caso: Editar Perfil (Opcional, pero si escribe, validamos)
            if (contrasena.trim() !== "" && contrasena.length < 4) {
                errores.push("La nueva contraseña debe tener al menos 4 caracteres.");
            }
        }

        // Verificar si hay errores
        if (errores.length > 0) {
            setError(errores.join(" | ")); // Los unimos con una barrita para que no ocupe tanto espacio
            return; // BLOQUEAMOS la ejecución aquí
        }

        // validamos si cambiamos algun dato:

        if (usuario) {
            const huboCambioNombre = nombreUsuario !== usuario.nombreUsuario;

            if (!huboCambioNombre && contrasena === "") {
                // En este caso, no es un "error" de tipeo, pero bloqueamos el envío
                showNotification("No se detectaron cambios para actualizar.", "warning");
                return; // Cortamos acá sin mostrar el Alert rojo, usamos la notificación azul
            }
        }

        // 1. Verificación de seguridad (Guarda)
        if (!token || !id) return;

        //const datosParaEnviar: Partial<Usuario> = {};
        const datosParaEnviar: Partial<UsuarioAltaDTO> = {};
        // Solo agregar si cambió respecto al original que vino por props
        //console.log(`nombre: ${nombreUsuario} vs ${usuario?.nombreUsuario}`);
        if (nombreUsuario !== usuario?.nombreUsuario) {
            datosParaEnviar.nombreUsuario = nombreUsuario;
        }

        // Lógica de contraseña
        if (contrasena.trim() !== '' && usuario) {
            //if (contrasena.length < 8) {
            //alert("La nueva contraseña debe tener al menos 8 caracteres.");
            //return;
            //}
            datosParaEnviar.contrasena = contrasena;
        }

        if (usuario) {
            // --- CASO EDICIÓN ---
            /*actualizarUsuario(token, usuario.id, datosParaEnviar)
                .then((respuesta) => {
                    // Actualizamos el contexto global con el nuevo token
                    iniciarSesion(respuesta.token);

                    showNotification("¡Perfil actualizado con éxito!", 'success')
                    //onGuardar(respuesta.usuario);
                })
                .catch(procesarError);*/
        } else {
            const datos: UsuarioAltaDTO = {
                nombreUsuario: nombreUsuario,
                contrasena: contrasena,
                rol: rol as 'GERENTE' | 'ADMINISTRADOR'
            };

            crearUsuario(token, datos)
                .then((usuarioCreado) => {
                    onGuardar(usuarioCreado)
                    showNotification("¡Usuario creado con éxito!", 'success')
                })
                .catch(procesarError);
        }
    };


    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, display: 'flex', flexDirection: 'column', gap: 3, }}>
            {usuario === null && (
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 2,
                            fontWeight: 'bold',
                            textAlign: 'center',    // Lo centra en la caja
                            fontStyle: 'normal',    // Sacamos el itálico heredado del Layout
                            textDecoration: 'none', // Aseguramos que no tenga subrayado
                            //textTransform: 'uppercase' // Lo mantiene en mayúsculas para que sea "estricto"
                        }}
                    >
                        Nuevo Usuario
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Box>
            )}
            {/* EL ALERT DE ERRORES */}
            {error && (
                <Alert severity="error" sx={{ border: '1px solid #d32f2f' }}>
                    {error}
                </Alert>
            )}
            <FormControl disabled={usuario != null}>
                <InputLabel> ROL </InputLabel>
                <Select label='ROL' onChange={(e) => setRol(e.target.value as Usuario['rol'])} value={rol}>
                    <MenuItem value="GERENTE">GERENTE</MenuItem>
                    <MenuItem value="ADMINISTRADOR">ADMINISTRADOR</MenuItem>
                </Select>
            </FormControl>
            <CampoTexto label="USUARIO" value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)} maxLength={30}></CampoTexto>
            <CampoTexto label="CONTRASEÑA" value={contrasena}
                onChange={(e) => setContrasena(e.target.value)} maxLength={50}></CampoTexto>

            <Box sx={{
                display: 'flex',
                justifyContent: 'center', // Centra horizontalmente en Flex
                alignItems: 'center',     // Centra verticalmente
                gap: 2,                   // Espacio entre Cancelar, Divider y Guardar
                fontStyle: 'normal'
            }}>
                <Typography
                    onClick={onCancelar}
                    sx={{
                        color: '#2e2c2c',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >Cancelar</Typography>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Typography
                    onClick={handleGuardar}
                    sx={{
                        color: 'blue',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >Guardar</Typography>
            </Box>
        </Box>
    )
}

export default FormularioUsuario