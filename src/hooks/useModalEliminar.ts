import { useState } from 'react';

export function useModalEliminar<T>() {
    const [open, setOpen] = useState<boolean>(false);
    const [seleccionado, setSeleccionado] = useState<T | null>(null);

    const abrirModal = (item: T) => {
        setSeleccionado(item);
        setOpen(true);
    };

    const cerrarModal = () => {
        setOpen(false);
        setSeleccionado(null);
    };

    return {
        open,
        seleccionado,
        abrirModal,
        cerrarModal
    };
}