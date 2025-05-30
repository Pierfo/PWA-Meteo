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
import { createTheme } from '@mui/material/styles';
// import {themeOptions} from './theme.js'
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Switch, Box } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AnimationIcon from '@mui/icons-material/Animation';

import MotionPhotosAutoIcon from '@mui/icons-material/MotionPhotosAuto';
import MotionPhotosOffIcon from '@mui/icons-material/MotionPhotosOff';






function isLight(g){
  return g=='light';
}

// Inverte il valore del tema
function invert(theme) {
  return isLight(theme) ? "dark" : "light";
}


export default function Temax (){
  
  let prefersDark;
  
  // Se non è salvata alcuna preferenza sul tema usa il tema di default del sistema
  if(!window.localStorage.getItem("preferred-theme")) {
    prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  }

  // Carica il tema salvato dall'utente
  else {
    if(window.localStorage.getItem("preferred-theme") === "dark") {
      prefersDark = true;
    }

    if(window.localStorage.getItem("preferred-theme") === "light") {
      prefersDark = false;
    }
  }

  console.log(prefersDark);
  
  const [themeMode, setThemeMode] = useState(prefersDark ? 'dark' : 'light');
  const [animation, setAnimation] = useState(window.localStorage.getItem("prefers-animations") && window.localStorage.getItem("prefers-animations") === "true");
  const [callBackAnimation, setCallBackAnimation] = useState(0);

  const themeOptions = {
    palette: {
      mode: themeMode,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#f50057',
      },
    },
  };

  const theme = createTheme(themeOptions);

  console.log("callBackAnimation" ,callBackAnimation);
  
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {(animation && (callBackAnimation > 0)) && <RainBackground wind={callBackAnimation} color={isLight(themeMode) ? 'primary' : 'with'}/>}
        {/* <SnowBackground></SnowBackground> */}
        {/* <SunnyBackground></SunnyBackground> */}
        <Box sx={{display: 'flex', width: 200}}>
          <Box
            sx={{
              position: 'absolute',
              ml: '10px',
              display: 'flex',
              alignItems: 'center',
              height: 56,
            }}
            >
            <LightModeIcon color={isLight(themeMode) ? 'primary' : 'with'} />
            <Switch
              checked={!isLight(themeMode)}
              onChange={() => {
                const newThemeMode = invert(themeMode);
                setThemeMode(newThemeMode);
                window.localStorage.setItem("preferred-theme", newThemeMode);
              }}
              color="default"
            />
            <DarkModeIcon color={isLight(themeMode) ? 'with' : 'primary'} />
          </Box>

          <Box
            sx={{
              position: 'absolute',
              mr: '10px',
              display: 'flex',
              alignItems: 'center',
              height: 56,
              right: 0,
            }}
            >
            <MotionPhotosOffIcon color={animation ? 'with' : 'primary'}/>
            <Switch
              checked={animation}
              onChange={() => {
                const newAnimation = !animation;
                setAnimation(newAnimation);

                window.localStorage.setItem("prefers-animations", newAnimation.toString());
              }}
              color="default"
              />
            <MotionPhotosAutoIcon color={animation ? 'primary' : 'with'}/>
          </Box>
        </Box>
        {/* <Button sx={{position: 'absolute', mt: 2, mr: 'auto'}} onClick={() => {isLight(themeMode) ? setThemeMode('dark') : setThemeMode('light')}}>cambio colore</Button> */}
        <Input2 callBack={(i) => {setCallBackAnimation(i)}}></Input2>
      </ThemeProvider>
    
    </>
  )
}
