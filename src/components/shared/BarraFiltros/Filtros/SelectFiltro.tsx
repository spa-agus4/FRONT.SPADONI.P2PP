import { Select, MenuItem, type SelectChangeEvent } from '@mui/material';

// Interfaz genérica para que sirva con cualquier tipo de dato (string, estados, roles, etc.)
interface Opcion<T> {
    valor: T;
    etiqueta: string;
}

interface SelectFiltroProps<T extends string> {
    value: T;
    onChange: (nuevoValor: T) => void;
    opciones: Opcion<T>[];
    minWidth?: number;
}

export default function SelectFiltro<T extends string>({
    value,
    onChange,
    opciones,
    minWidth = 130
}: SelectFiltroProps<T>) {
    
    const handleChange = (event: SelectChangeEvent<T>) => {
        onChange(event.target.value as T);
    };

    return (
        <Select
            variant="standard"
            value={value}
            onChange={handleChange}
            sx={{
                fontSize: '1rem',
                fontWeight: 500,
                minWidth: minWidth,
                '&:before': { borderBottom: 'none' },
                '&:after': { borderBottom: 'none' }
            }}
        >
            {opciones.map((opcion) => (
                <MenuItem key={opcion.valor} value={opcion.valor}>
                    {opcion.etiqueta}
                </MenuItem>
            ))}
        </Select>
    );
}