import { TextField, type TextFieldProps } from '@mui/material'

interface Props extends Omit<TextFieldProps, 'inputProps'> {
    maxLength?: number
    mostrarContador?: boolean
    //placeholder?: string
}

function CampoTexto({ maxLength, mostrarContador = false, value, helperText, ...resto }: Props) {
    const longitud = typeof value === 'string' ? value.length : 0

    return (
        <TextField
            //placeholder=''
            value={value}
            inputProps={{ maxLength }}
            helperText={mostrarContador && maxLength ? `${longitud}/${maxLength}` : helperText}
            {...resto}
        />
    )
}

export default CampoTexto