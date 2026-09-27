import { useState } from "react";
import type { Usuario, UsuarioAltaDTO, UsuarioListadoDTO } from "../types";
import { crearUsuario } from '../services/usuarioService';
import { useNotification } from '../context/NotificationContext';
import { useProcesarError } from "./useProcesarError";
import { validarFormularioUsuario } from "../utils/validations/validarFormularioUsuario";

interface UseFormUsuarioProps {
    onGuardar: (usuario: UsuarioListadoDTO) => void;
}

export function useFormUsuario({ onGuardar }: UseFormUsuarioProps) {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [rol, setRol] = useState<'GERENTE' | 'ADMINISTRADOR'>('GERENTE');
    const [error, setError] = useState<string | null>(null);

    const { showNotification } = useNotification();
    const { procesarError } = useProcesarError();

    const handleGuardar = () => {
        setError(null);
        
        // Validaciones estrictas de creación
        const errores = validarFormularioUsuario(nombreUsuario, contrasena);

        if (errores.length > 0) {
            setError(errores.join(" | "));
            return;
        }

        const datos: UsuarioAltaDTO = {
            nombreUsuario: nombreUsuario,
            contrasena: contrasena,
            rol: rol
        };

        crearUsuario(datos)
            .then((usuarioCreado) => {
                onGuardar(usuarioCreado);
                showNotification("¡Usuario creado con éxito!", 'success');
            })
            .catch(procesarError);
    };

    return {
        // Estados
        nombreUsuario,
        contrasena,
        rol,
        error,
        // Setters
        setNombreUsuario,
        setContrasena,
        setRol,
        // Acciones
        handleGuardar
    };
}