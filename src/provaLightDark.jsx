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


export default function Temax (){
  
  let prefersDark;
  
  if(!window.localStorage.getItem("preferred-theme")) {
    prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  }

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
  const [animation, setAnimation] = useState(true);
  const [callBackAnimation, setCallBackAnimation] = useState(-1);

  function setCallBack(i){
    setCallBackAnimation(i);
  }

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

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {animation && <RainBackground wind={20} color={isLight(themeMode) ? 'primary' : 'with'}/>}
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
                if(isLight(themeMode)) {
                  setThemeMode('dark');
                  window.localStorage.setItem("preferred-theme", "dark");
                } 
                else{
                  setThemeMode('light');
                  window.localStorage.setItem("preferred-theme", "light");
                }}
              }
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
              onChange={() => {setAnimation(!animation)}}
              color="default"
              />
            <MotionPhotosAutoIcon color={animation ? 'primary' : 'with'}/>
          </Box>
        </Box>
        {/* <Button sx={{position: 'absolute', mt: 2, mr: 'auto'}} onClick={() => {isLight(themeMode) ? setThemeMode('dark') : setThemeMode('light')}}>cambio colore</Button> */}
        <Input2 callBack={setCallBack}></Input2>
      </ThemeProvider>
    
    </>
  )
}
