import { GenericIconButton, type GenericIconProps } from "./GenericIconButton";
import CheckIcon from '@mui/icons-material/Check';

export function BotonCheck({
    onClick,
    tooltipText = "Guardar",
    tooltipPlacement = "left",
    hoverColor = '#2e7d32',
    hoverBackColor = 'rgba(46, 125, 50, 0.08)'
}: GenericIconProps) {

    return (
        <GenericIconButton
            onClick={onClick}
            tooltipText={tooltipText}
            tooltipPlacement={tooltipPlacement}
            hoverColor={hoverColor}
            hoverBackColor={hoverBackColor}
        >
            <CheckIcon fontSize="small" />
        </GenericIconButton>
    );
}