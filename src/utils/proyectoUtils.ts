import type { EstadoProceso, EstadoProyecto, ProyectoDatosDTO } from "../types";

export function construirProyectoDatos(datos: {
    nombre: string;
    clienteId: number;
    canalSolicitud: ProyectoDatosDTO['canalSolicitud'];
    fechaInicio: string;
    fechaFinalizacion: string;
    presupuesto: number;
    estadoProyecto: EstadoProyecto;
    estadoProceso: EstadoProceso;
}): ProyectoDatosDTO {
    return {
        ...datos,
        fechaInicio: datos.fechaInicio || null,
        fechaFinalizacion: datos.fechaFinalizacion || null
    };
}