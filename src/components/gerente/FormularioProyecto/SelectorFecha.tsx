import { Box, Typography, TextField } from '@mui/material';
import { formatearFechaVista } from '../../../utils/dateUtils';

interface SelectorFechaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isReadOnly?: boolean;
}

export const SelectorFecha: React.FC<SelectorFechaProps> = ({
  label,
  value,
  onChange,
  isReadOnly = false,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      <Typography sx={{ fontWeight: '500' }}>{label}:</Typography>
      {isReadOnly ? (
        <Typography sx={{ color: '#333' }}>{formatearFechaVista(value)}</Typography>
      ) : (
        <TextField
          variant="standard"
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      )}
    </Box>
  );
};