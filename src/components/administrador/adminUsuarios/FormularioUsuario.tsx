import type { Usuario, UsuarioListadoDTO } from "../../../types"
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material'
import CampoTexto from "../../shared/CampoTexto";
import FormularioGeneral from "../../shared/formularios/FormularioGeneral";
import { useFormUsuario } from "../../../hooks/useFormUsuario";

interface Props {
    onGuardar: (usuario: UsuarioListadoDTO) => void
    onCancelar: () => void
}

function FormularioUsuario({ onGuardar, onCancelar }: Props) {
    
    const {
        nombreUsuario,
        contrasena,
        rol,
        error,
        setNombreUsuario,
        setContrasena,
        setRol,
        handleGuardar
    } = useFormUsuario({ onGuardar });

    return (
        <FormularioGeneral
            titulo="Nuevo Usuario"
            error={error}
            onGuardar={handleGuardar}
            onCancelar={onCancelar}
        >
            <FormControl>
                <InputLabel> ROL </InputLabel>
                <Select 
                    label='ROL' 
                    onChange={(e) => setRol(e.target.value as 'GERENTE' | 'ADMINISTRADOR')} 
                    value={rol}
                >
                    <MenuItem value="GERENTE">GERENTE</MenuItem>
                    <MenuItem value="ADMINISTRADOR">ADMINISTRADOR</MenuItem>
                </Select>
            </FormControl>
            
            <CampoTexto 
                label="USUARIO" 
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)} 
                maxLength={30}
            />
            
            <CampoTexto 
                label="CONTRASEÑA" 
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)} 
                maxLength={50}
            />
        </FormularioGeneral>
    )
}

export default FormularioUsuario;