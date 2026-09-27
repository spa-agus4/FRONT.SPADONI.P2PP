import { useNotification } from '../context/NotificationContext';
import { traducirError } from '../utils/errorManager';

export const useProcesarError = () => {
    const { showNotification } = useNotification();

    const procesarError = (err: unknown) => {
        console.error(err);
        const msg = traducirError(err);
        showNotification(msg, 'error');
    };

    return { procesarError };
};