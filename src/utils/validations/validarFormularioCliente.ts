export const validarFormularioCliente = (
    nombre: string,
    email: string,
    direccion: string,
    telefono: string
): string[] => {
    const errores: string[] = [];

    const emailEsValido = /\S+@\S+\.\S+/.test(email.trim());
    const telefonoEsValido = telefono.trim().length >= 8; // Requisistos para q el contacto sea válido

    /*
    if (nombre.trim().length < 3) {
        errores.push("El nombre del cliente debe tener al menos 3 caracteres.");
    }

    // Si ambos están vacíos -> error general
    if (email.trim().length === 0 && telefono.trim().length === 0) {
        errores.push("Debe cargar al menos un método de contacto.");
    } else {
        // Si ingresó email y está mal, no importa cómo esté el teléfono -> marca error de email
        if (email.trim().length > 0 && !emailEsValido) {
            errores.push("El formato del email no es válido.");
        }
        // Si ingresó teléfono y está mal, no importa cómo esté el email -> marca error de teléfono
        if (telefono.trim().length > 0 && !telefonoEsValido) {
            errores.push("Ingrese un teléfono válido.");
        }
    }*/

   /* if (direccion.trim().length === 0) {
        errores.push("La dirección es obligatoria.");
    }*/

    return errores;
};