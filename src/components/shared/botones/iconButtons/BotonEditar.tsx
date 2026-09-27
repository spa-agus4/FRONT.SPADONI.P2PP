import { GenericIconButton, type GenericIconProps } from "./GenericIconButton";
import EditIcon from '@mui/icons-material/Edit';

export function BotonEditar({
    onClick,
    tooltipText = "Editar",
    tooltipPlacement = "top",
    hoverColor,
    hoverBackColor,
}: GenericIconProps) {

    return (
        <GenericIconButton
            onClick={onClick}
            tooltipText={tooltipText}
            tooltipPlacement={tooltipPlacement}
            hoverColor={hoverColor}
            hoverBackColor={hoverBackColor}
        >
            <EditIcon fontSize="small" />
        </GenericIconButton>
    );
}