import { TableRow, TableCell, Alert, IconButton, Tooltip } from '@mui/material';
import type { Usuario, Cliente, UsuarioListadoDTO } from '../../../../types';
import CampoTexto from '../../../shared/CampoTexto';
import { BotonEditar } from '../../../shared/botones/iconButtons/BotonEditar';
import { BotonHabilitar } from '../../../shared/botones/iconButtons/BotonHabilitar';
import { BotonEliminar } from '../../../shared/botones/iconButtons/BotonEliminar';
import { BotonCheck } from '../../../shared/botones/iconButtons/BotonCheck';
import { BotonCancelar } from '../../../shared/botones/iconButtons/BotonCancelar';

interface FilaUsuarioProps {
    usuarioListado: UsuarioListadoDTO;

    editando: boolean;

    nombreUsuario: string;
    nuevaContrasena: string;

    error: string | null;

    esUsuarioLogueado: boolean;

    onEditar: () => void;
    onGuardar: () => void;
    onCancelar: () => void;
    onHabilitar: () => void;
    onEliminar: () => void;

    onNombreUsuarioChange: (value: string) => void;
    onContrasenaChange: (value: string) => void;
}

function FilaUsuario({
    usuarioListado,
    editando,
    nombreUsuario,
    nuevaContrasena,
    error,
    esUsuarioLogueado,
    onEditar,
    onGuardar,
    onCancelar,
    onHabilitar,
    onEliminar,
    onNombreUsuarioChange,
    onContrasenaChange
}: FilaUsuarioProps) {

    const esInactivo = usuarioListado.usuario.activo === false;
    const sinCredenciales = usuarioListado.usuario.rol === 'CLIENTE' && !usuarioListado.usuario.nombreUsuario;

    //const cliente = usuario as Cliente;

    return (
        <>
            {error && editando && (
                <TableRow>
                    <TableCell
                        colSpan={5}
                        sx={{
                            padding: 0,
                            border: 'none'
                        }}
                    >
                        <Alert
                            severity="error"
                            variant="filled"
                            sx={{
                                borderRadius: 0,
                                fontSize: '1rem',
                                fontWeight: 'bold'
                            }}
                        >
                            {error}
                        </Alert>
                    </TableCell>
                </TableRow>
            )}

            <TableRow
                sx={{
                    fontSize: '1.2rem',
                    opacity: esInactivo ? 0.55 : 1,
                    backgroundColor: esInactivo ? '#f5f5f5' : 'inherit',
                    fontStyle: esInactivo ? 'italic' : 'normal'
                }}
                hover
            >
                <TableCell sx={{ fontSize: '1.2rem' }}>
                    {usuarioListado.usuario.id}
                </TableCell>

                <TableCell sx={{ fontSize: '1.2rem' }}>
                    {usuarioListado.usuario.rol}
                </TableCell>

                <TableCell sx={{ fontSize: '1.2rem' }}>
                    {editando ? (
                        <CampoTexto
                            value={nombreUsuario}
                            variant="outlined"
                            onChange={(e) =>
                                onNombreUsuarioChange(e.target.value)
                            }
                            size="small"
                            maxLength={30}
                            placeholder={usuarioListado.usuario.rol === 'CLIENTE' ? usuarioListado.datosCliente.nombre : ''}    // si es cliente muestro su nombre como placeholder par a darle una ide al admin de que usuario está haciendo
                        />
                    ) : (
                        usuarioListado.usuario.nombreUsuario
                            ? usuarioListado.usuario.nombreUsuario
                            : sinCredenciales
                                ? `${usuarioListado.datosCliente.nombre} (sin credenciales)`
                                : '—'
                    )}
                </TableCell>

                <TableCell>
                    {editando ? (
                        <CampoTexto
                            variant="outlined"
                            value={nuevaContrasena}
                            onChange={(e) =>
                                onContrasenaChange(e.target.value)
                            }
                            size="small"
                            maxLength={50}
                        />
                    ) : (
                        usuarioListado.usuario.nombreUsuario
                            ? '••••••••'
                            : '—'
                    )}
                </TableCell>

                <TableCell align="center">
                    {editando ? (
                        <>
                            <BotonCheck onClick={onGuardar}/>

                            <BotonCancelar onClick={onCancelar}/>
                        </>
                    ) : (
                        <>
                            {(!esInactivo || sinCredenciales) && (
                                <BotonEditar onClick={onEditar}
                                    tooltipPlacement='left'
                                    tooltipText={
                                        sinCredenciales
                                            ? 'Asignar credenciales'
                                            : 'Editar'
                                    } />
                            )}

                            {esInactivo && !sinCredenciales && (
                                <BotonHabilitar onClick={onHabilitar} />
                            )}

                            {!esInactivo && !esUsuarioLogueado && (
                                <BotonEliminar
                                    onClick={onEliminar}
                                    tooltipPlacement='right'
                                />
                            )}
                        </>
                    )}
                </TableCell>
            </TableRow>
        </>
    );
}

export default FilaUsuario;