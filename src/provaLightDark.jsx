import './service-worker-registration.js'
import Input2 from './input.jsx'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import RainBackground from './provasfondopioggia.jsx'
import SnowBackground from './nevebackground.jsx'
import { createTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Switch, Box } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MotionPhotosAutoIcon from '@mui/icons-material/MotionPhotosAuto';
import MotionPhotosOffIcon from '@mui/icons-material/MotionPhotosOff';
import { BsWindowX } from 'react-icons/bs';

export default function Temax (){  
  const [darkMode, setDarkMode] = useState(
    (!window.localStorage.getItem("preferred-theme")) || (window.localStorage.getItem("preferred-theme") === "dark")
  );
  const [animation, setAnimation] = useState(window.localStorage.getItem("prefers-animations") && window.localStorage.getItem("prefers-animations") === "true");
  const [callBackAnimation, setCallBackAnimation] = useState(0);

  let themeMode = darkMode ? "dark" : "light";

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
        {/* <SnowBackground wind={20}/> */}
        {/* <RainBackground wind={20}/> */}
        {(animation && (callBackAnimation < 0)) && <SnowBackground wind={(callBackAnimation)*-1} color={!darkMode ? 'primary' : 'with'}/>}
        {(animation && (callBackAnimation > 0)) && <RainBackground wind={callBackAnimation} color={!darkMode ? 'primary' : 'with'}/>}
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
            <LightModeIcon color={!darkMode ? 'primary' : 'white'} />
            <Switch
              checked={darkMode}
              onChange={() => {
                window.localStorage.setItem("preferred-theme", darkMode ? "light" : "dark");
                setDarkMode(!darkMode);
              }}
              color="default"
            />
            <DarkModeIcon color={!darkMode ? 'white' : 'primary'} />
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
                window.localStorage.setItem("prefers-animations", newAnimation.toString());
                
                setAnimation(newAnimation);
              }}
              color="default"
              />
            <MotionPhotosAutoIcon color={animation ? 'primary' : 'with'}/>
          </Box>
        </Box>
        <Input2 callBack={(i) => {setCallBackAnimation(i)}}></Input2>
      </ThemeProvider>
    </>
  )
}
