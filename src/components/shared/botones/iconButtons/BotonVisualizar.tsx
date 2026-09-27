import { GenericIconButton, type GenericIconProps } from "./GenericIconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';

export function BotonVisualizar({
    onClick,
    tooltipText = "Ver detalles",
    tooltipPlacement = "top",
    hoverColor = '#2fadd3',
    hoverBackColor = 'rgba(47, 173, 211, 0.08)'
}: GenericIconProps) {

    return (
        <GenericIconButton
            onClick={onClick}
            tooltipText={tooltipText}
            hoverColor={hoverColor}
            hoverBackColor={hoverBackColor}
            tooltipPlacement={tooltipPlacement}
        >
            <VisibilityIcon fontSize="small" />
        </GenericIconButton>
    );
}