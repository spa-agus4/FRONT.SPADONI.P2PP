import type { Desarrollador } from "../../../types"

import CampoTexto from "../../shared/CampoTexto"
import FormularioGeneral from "../../shared/formularios/FormularioGeneral";
import { useFormDesarrollador } from "../../../hooks/useFormDesarrollador";

interface Props {
    onGuardar: (dev: Desarrollador) => void
    onCancelar: () => void
}

function FormularioDesarrollador({ onGuardar, onCancelar }: Props) {

    const {
        nombreDesarrollador,
        habilidades,
        error,
        setNombreDesarrollador,
        setHabilidades,
        handleGuardar
    } = useFormDesarrollador({ onGuardar });

    return (
        <FormularioGeneral
            titulo="Nuevo Desarrollador"
            error={error}
            onGuardar={handleGuardar}
            onCancelar={onCancelar}
        >
            <CampoTexto
                label="NOMBRE"
                value={nombreDesarrollador}
                onChange={(e) => setNombreDesarrollador(e.target.value)}
            />

            {/*<SwitchDisponibilidad
                valor={disponible}
                onChange={setDisponible}
                textoIzquierdo="No disponible"
                textoDerecho="Disponible"
            />*/}

            <CampoTexto
                label="HABILIDADES"
                value={habilidades}
                onChange={(e) => setHabilidades(e.target.value)}
                maxLength={200}
                mostrarContador={true}
            />
        </FormularioGeneral>
    )
}

export default FormularioDesarrollador;