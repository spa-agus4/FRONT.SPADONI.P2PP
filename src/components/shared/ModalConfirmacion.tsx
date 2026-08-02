import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";

interface Props {
    open: boolean
    onClose: () => void
    titulo: string
    mensaje: React.ReactNode
    onConfirmar: () => void
    textoConfirmar?: string
    colorConfirmar?: string
}

export default function ModalConfirmacion(props: Props) {

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            // Estilo retro para el modal
            PaperProps={{
                sx: {
                    border: '3px solid black',
                    borderRadius: 2,
                    backgroundColor: '#e0e0e0',
                }
            }}
        >
            <DialogTitle sx={{ backgroundColor: 'black', color: 'white', py: 1, fontSize: '1rem' }}>
                {props.titulo}
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                {props.mensaje}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>

                <Typography
                    onClick={props.onClose}
                    sx={{
                        fontSize: 20,
                        color: '#2e2c2c',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    Cancelar
                </Typography>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Typography
                    onClick={props.onConfirmar}
                    sx={{
                        fontSize: 20,
                        color: props.colorConfirmar,
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    {props.textoConfirmar}
                </Typography>
            </DialogActions>
        </Dialog>
    )
}