export const validarFormularioUsuario = (
    nombreUsuario: string,
    contrasena: string
): string[] => {
    const errores: string[] = [];

    if (nombreUsuario.trim().length < 3) {
        errores.push("El nombre de usuario debe tener al menos 3 caracteres.");
    }

    if (nombreUsuario.includes(" ")) {
        errores.push("El nombre de usuario no puede contener espacios.");
    }

    if (contrasena.length < 4) {
        errores.push(
            "La contraseña es obligatoria y debe tener al menos 4 caracteres."
        );
    }

    return errores;
};