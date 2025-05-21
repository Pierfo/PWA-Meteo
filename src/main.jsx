import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './service-worker-registration.js'
import Input2 from './input.jsx'
// import {themeOptions} from './tema'
import theme from './theme.js'
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';



// const theme = createTheme(themeOptions);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Input2></Input2>
    </ThemeProvider>
  </StrictMode>
)
