import { GenericIconButton, type GenericIconProps } from "./GenericIconButton";
import CloseIcon from '@mui/icons-material/Close';

export function BotonCancelar({
    onClick,
    tooltipText = "Cancelar",
    tooltipPlacement = "right",
    hoverColor = '#d32f2f',
    hoverBackColor = 'rgba(211, 47, 47, 0.08)',
}: GenericIconProps) {

    return (
        <GenericIconButton
            onClick={onClick}
            tooltipText={tooltipText}
            tooltipPlacement={tooltipPlacement}
            hoverColor={hoverColor}
            hoverBackColor={hoverBackColor}
        >
            <CloseIcon fontSize="small" />
        </GenericIconButton>
    );
}