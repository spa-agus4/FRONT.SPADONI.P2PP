export const formatearFechaInput = (fecha: Date | string | null | undefined): string => {
    if (!fecha) return '';

    return new Date(fecha).toISOString().split('T')[0];
};

export const formatearFechaVista = (fecha: Date | string | null | undefined): string => {
    if (!fecha) return 'Sin especificar';

    return new Date(fecha).toLocaleDateString('es-AR');
};