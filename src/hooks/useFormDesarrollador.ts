import { useState } from "react"
import type { Desarrollador, DesarrolladorAltaDTO } from "../types"
import { crearDesarrollador } from '../services/desarrolladorService'
import { useNotification } from '../context/NotificationContext';
import { useProcesarError } from "../hooks/useProcesarError";

interface UseFormDesarrolladorProps {
    onGuardar: (dev: Desarrollador) => void;
}

export function useFormDesarrollador({onGuardar}: UseFormDesarrolladorProps){

    const [nombreDesarrollador, setNombreDesarrollador] = useState<string>('')
        //const [disponible, setDisponible] = useState<boolean>(true)
        const [habilidades, setHabilidades] = useState<string>('')
        
        const { showNotification } = useNotification()
        const { procesarError } = useProcesarError();
    
        const [error, setError] = useState<string | null>(null);
    
        const handleGuardar = () => {
            setError(null);
            const errores: string[] = [];
    
            if (nombreDesarrollador.trim().length < 3) {
                errores.push("El nombre de desarrollador debe tener al menos 3 caracteres.");
            }
    
            if (errores.length > 0) {
                setError(errores.join(" | "));
                return;
            }
    
            if (habilidades === "") {
                showNotification("Desarrollador creado sin habilidades", 'warning');
            }
    
            const datos: DesarrolladorAltaDTO = {
                nombre: nombreDesarrollador,
                habilidades: habilidades
            };
    
            crearDesarrollador(datos)
                .then((desarrolladorCreado) => {
                    onGuardar(desarrolladorCreado);
                    showNotification("¡Desarrollador creado con éxito!", 'success');
                })
                .catch(procesarError);
        };

        return {
        // Estados
        nombreDesarrollador,
        habilidades,
        error,
        // Setters
        setNombreDesarrollador,
        setHabilidades,
        // Acciones
        handleGuardar
    };
}