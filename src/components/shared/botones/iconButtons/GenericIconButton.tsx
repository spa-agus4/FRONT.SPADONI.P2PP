import React from 'react';
import { IconButton, Tooltip, type TooltipProps } from '@mui/material';

export interface GenericIconProps {
    onClick: () => void;
    size?: "small" | "medium" | "large";
    color?: string;
    hoverColor?: string;
    hoverBackColor?: string;
    children?: React.ReactNode;
    tooltipText?: string;
    tooltipPlacement?: TooltipProps['placement'];
}

export function GenericIconButton({ 
    onClick, 
    size = "small",
    color = '#424242',
    hoverColor,
    hoverBackColor = 'rgba(0, 0, 0, 0.04)',
    children,
    tooltipText,
    tooltipPlacement = "top"
}: GenericIconProps) {

    return (
        <Tooltip title={tooltipText} placement={tooltipPlacement}>
            <IconButton
                size={size}
                sx={{ 
                    color: color, 
                    '&:hover': { 
                        backgroundColor: hoverBackColor,
                        color: hoverColor ? hoverColor : color 
                    } 
                }}
                onClick={onClick}
            >
                {children}
            </IconButton>
        </Tooltip>
    );
}