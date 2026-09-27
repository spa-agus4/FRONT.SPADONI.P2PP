import ModalConfirmacion from './ModalConfirmacion';

interface ModalEliminarProps {
    open: boolean;
    onClose: () => void;
    mensaje: React.ReactNode; // El mensaje es personalizado porque depende del objeto
    onConfirmar: () => void;
}

export default function ModalEliminar({
    open,
    onClose,
    mensaje,
    onConfirmar
}: ModalEliminarProps) {
    return (
        <ModalConfirmacion
            open={open}
            onClose={onClose}
            titulo="Confirmar eliminación"
            mensaje={mensaje}
            onConfirmar={onConfirmar}
            textoConfirmar="Eliminar"
            colorConfirmar="red"
        />
    );
}