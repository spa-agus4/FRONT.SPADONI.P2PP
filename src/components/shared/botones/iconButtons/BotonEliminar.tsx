import { GenericIconButton, type GenericIconProps } from "./GenericIconButton";
import DeleteIcon from '@mui/icons-material/Delete';

export function BotonEliminar({
    onClick,
    tooltipText = "Eliminar",
    tooltipPlacement = "bottom",
    hoverColor = '#d32f2f',
    hoverBackColor = 'rgba(211, 47, 47, 0.08)'
}: GenericIconProps) {

    return (
        <GenericIconButton
            onClick={onClick}
            tooltipText={tooltipText}
            hoverColor={hoverColor}
            hoverBackColor={hoverBackColor}
            tooltipPlacement={tooltipPlacement}
        >
            <DeleteIcon fontSize="small" />
        </GenericIconButton>
    );
}