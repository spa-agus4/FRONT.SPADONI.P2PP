import { FormControlLabel, Checkbox, Typography } from '@mui/material';

interface CheckboxFiltroProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
}

export default function CheckboxFiltro({ checked, onChange, label }: CheckboxFiltroProps) {
    return (
        <FormControlLabel
            sx={{ mr: 0, whiteSpace: 'nowrap' }}
            control={
                <Checkbox
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }}
                />
            }
            label={
                <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: 'black' }}>
                    {label}
                </Typography>
            }
        />
    );
}