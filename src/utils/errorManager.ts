export const traducirError = (err: unknown): string => {
    // La conexión ni se estableció (server caído, sin red)
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
        return "No se pudo conectar con el servidor. Verificá tu conexión e intentá de nuevo.";
    }

    // Mensaje que ya viene armado y en español desde el backend
    //    (nunca es un texto de SQL/stacktrace, gracias al GlobalExceptionHandler)
    if (err instanceof Error && err.message) {
        return err.message;
    }

    return "Ocurrió un error inesperado. Intentá más tarde.";
};