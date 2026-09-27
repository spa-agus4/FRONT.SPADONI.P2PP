// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { NotificationProvider } from './context/NotificationContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import App from './App.tsx'
import { theme } from './theme.ts' // <-- Importas tu tema
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  </StrictMode>
)