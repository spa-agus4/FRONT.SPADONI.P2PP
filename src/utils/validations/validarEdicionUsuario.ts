import type { Usuario } from "../../types/usuario";

export const validarEdicionUsuario = (nombre: string, contrasena: string, original: Usuario): string[] => {
    const errores: string[] = [];
    const sinCredenciales = original.rol === 'CLIENTE' && !original.nombreUsuario;

    if (sinCredenciales && contrasena.trim() === '') {
        errores.push("Hace falta una contraseña para activar la cuenta.");
    }
    if (nombre.trim().length < 3) {
        errores.push("El nombre de usuario debe tener al menos 3 caracteres.");
    }
    if (nombre.includes(" ")) {
        errores.push("El nombre de usuario no puede contener espacios.");
    }
    if (contrasena.trim() !== "" && contrasena.length < 4) {
        errores.push("La contraseña debe tener al menos 4 caracteres.");
    }
    return errores;
}