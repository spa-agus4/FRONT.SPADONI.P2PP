import type { Cliente } from "../../types/cliente";

export const validarFormularioProyecto = (
    nombreProyecto: string,
    clienteSeleccionado: Cliente | null,
    presupuesto: number,
    fechaInicio: string,
    fechaFinalizacion: string
): string[] => {
    const errores: string[] = [];

    if (nombreProyecto.trim().length < 3) {
        errores.push("El nombre del proyecto debe tener al menos 3 caracteres.");
    }
    if (!clienteSeleccionado) {
        errores.push("El cliente es obligatorio.");
    }
    if (presupuesto < 0) {
        errores.push("El presupuesto no puede ser negativo.");
    }
    if (fechaInicio && fechaFinalizacion && new Date(fechaInicio) > new Date(fechaFinalizacion)) {
        errores.push("La fecha de inicio no puede ser posterior a la de finalización.");
    }

    return errores;
};