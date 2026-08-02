import { styled } from '@mui/material/styles';
import { Switch, Typography, Stack } from '@mui/material';

// 1. La base estilizada (lo que ya tenías)
const CustomSwitch = styled(Switch)(() => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#2e7d32', // Círculo Verde cuando ON
    '&:hover': {
      backgroundColor: 'rgba(46, 125, 50, 0.08)',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#2e7d32', // Barra Verde cuando ON
  },
  '& .MuiSwitch-switchBase': {
    color: '#424242', // Círculo Negro cuando OFF
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#424242', // Barra Negra cuando OFF
  },
}));

// 2. El componente que exportás con etiquetas a los lados
interface Props {
  valor: boolean;
  onChange: (nuevoValor: boolean) => void;
  textoIzquierdo?: string;
  textoDerecho?: string;
}

export default function SwitchDisponibilidad({ valor, onChange, textoIzquierdo, textoDerecho }: Props) {
  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
      {textoIzquierdo && (
        <Typography sx={{ color: !valor ? '#424242' : '#bdbdbd', fontWeight: !valor ? 'bold' : 'normal' }}>
          {textoIzquierdo}
        </Typography>
      )}
      
      <CustomSwitch 
        checked={valor} 
        onChange={(e) => onChange(e.target.checked)} 
      />

      {textoDerecho && (
        <Typography sx={{ color: valor ? '#2e7d32' : '#bdbdbd', fontWeight: valor ? 'bold' : 'normal' }}>
          {textoDerecho}
        </Typography>
      )}
    </Stack>
  );
}