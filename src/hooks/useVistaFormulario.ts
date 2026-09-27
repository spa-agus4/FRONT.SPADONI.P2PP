import { useState } from 'react';

export function useVistaFormulario<T>() {
    const [vista, setVista] = useState<'lista' | 'formulario'>('lista');
    const [itemAEditar, setItemAEditar] = useState<T | null>(null);

    // Función limpia para crear uno nuevo (limpia la basura anterior)
    const abrirParaCrear = () => {
        setItemAEditar(null);
        setVista('formulario');
    };

    // Función para editar (guarda el objeto y cambia la vista)
    const abrirParaEditar = (item: T) => {
        setItemAEditar(item);
        setVista('formulario');
    };

    // Vuelve a la lista y limpia la memoria
    const volverALista = () => {
        setVista('lista');
        setItemAEditar(null);
    };

    return {
        vista,
        itemAEditar,
        abrirParaCrear,
        abrirParaEditar,
        volverALista
    };
}