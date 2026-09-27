import { GenericIconButton, type GenericIconProps } from "./GenericIconButton";
import LockOpenIcon from '@mui/icons-material/LockOpen';

export function BotonHabilitar({
    onClick,
    tooltipText = "Habilitar usuario",
    tooltipPlacement = "top",
    color = '#2e7d32',
    hoverBackColor = 'rgba(46, 125, 50, 0.08)'
}: GenericIconProps) {

    return (
        <GenericIconButton
            onClick={onClick}
            tooltipText={tooltipText}
            color={color}
            tooltipPlacement={tooltipPlacement}
            hoverBackColor={hoverBackColor}
        >
            <LockOpenIcon fontSize="small" />
        </GenericIconButton>
    );
}