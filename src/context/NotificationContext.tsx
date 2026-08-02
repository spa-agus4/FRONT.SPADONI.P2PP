import { createContext, useState, useContext } from 'react' // Importamos useEffect

interface NotificationContextType {
    showNotification: (msg: string, sev: "success" | "error" | "info" | "warning") => void;
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
    setOpen: (open: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("")
    const [severity, setSeverity] = useState<"success" | "error" | "info" | "warning">("info")

    const showNotification = (msg: string, sev: "success" | "error" | "info" | "warning") => {
        setMessage(msg);
        setSeverity(sev);
        setOpen(true);
    };

    // 2. Pasamos TODO en el value
    return (
        <NotificationContext.Provider value={{ showNotification, open, message, severity, setOpen }}>
            {children}
        </NotificationContext.Provider>
    )
}

// 3. El hook queda limpio así:
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotification debe usarse dentro de NotificationProvider');
    return context;
}