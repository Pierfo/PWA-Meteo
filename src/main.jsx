import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './service-worker-registration.js'
import Input2 from './input.jsx'
// import {themeOptions} from './tema'
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import RainBackground from './provasfondopioggia.jsx'
import SnowBackground from './nevebackground.jsx'
import SunnyBackground from './provasfondosole.jsx'
import { createTheme } from '@mui/material/styles';
import {themeOptions} from './theme.js'


const theme = createTheme(themeOptions);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RainBackground wind={20}/>
      {/* <SnowBackground></SnowBackground> */}
      {/* <SunnyBackground></SunnyBackground> */}
      <Input2></Input2>
    </ThemeProvider>
  </StrictMode>
)
