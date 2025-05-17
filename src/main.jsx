import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './service-worker-registration.js'
import Input2 from './input.jsx'
import {themeOptions} from './tema'
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme(themeOptions);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <Input2></Input2>
    </ThemeProvider>
  </StrictMode>
)
