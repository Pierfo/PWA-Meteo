/**
 * Gestisce gli aspetti relativi allo sfondo, in particolare gestisce il tema (chiaro o scuro) e le animazioni
 * (attive o non attive). Crea inoltre due switch per permettere all'utente di esprimere le proprie preferenze
 * sul tema e sullo sfondo animato, salvando tali preferenze in localStorage.
 * 
 * Gli sfondi animati sono invocati in base alla preferenza dell'utente e alla condizione meteo del giorno 
 * (ricevuta trmite call back). In particolare il programma ha bisogno di conoscere il tipo di condizione meteo 
 * (per decidere se inserire la pioggia, la neve o nessuno sfondo) e la sua intensità (per decidere l'intensità del
 * parametro "vento": precipitazioni lievi, come "pioggia lieve" o "lieve nevicata", hanno vento di intensità 0 mentre 
 * precipitazioni intense, come "temporale" o "tempesta di neve", hanno vento di intensità massima).
 * 
 * Tema e sfondo sono aggiornati dinamicamente. 
 */

import Input from './input.jsx'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import RainBackground from './rainyBackground.jsx'
import SnowBackground from './snowyBackground.jsx'
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

  // Variabile che definisce se il tema è impostato su "dark" o meno. Il valore iniziale dipende dal valore della entry
  // "preferred-theme" salvata in localStorage; se l'utente non ha ancora specificato alcuna preferenza sul tema,
  // allora esso sarà in modalità dark
  const [darkMode, setDarkMode] = useState(
    ((window.localStorage.getItem("preferred-theme")) === null) || (window.localStorage.getItem("preferred-theme") === "dark")
  );
  // Variabile che definisce se lo sfondo animato è attivo o meno. Il valore iniziale dipende dal valore della entry
  // "prefers-animation" salvata in localStorage; se l'utente non ha ancora specificato alcuna preferenza sulle 
  // animazioni, allora queste saranno disabilitate
  const [animation, setAnimation] = useState(
    (window.localStorage.getItem("prefers-animations") != null) && (window.localStorage.getItem("prefers-animations") === "true")
  );
  // Variabile per salvare le condizioni meteo, utilizzate poi per decidere che sfondo animato usare
  // Variabile modificata in MeteoCard, verrà passata come prop tramite Input a MeteoCard
  const [callBackAnimation, setCallBackAnimation] = useState(0);

  // Traduzione a parole del true o false dello useState darkMode
  let themeMode = darkMode ? "dark" : "light";

  // Creazione del json contenente il tema di mui.
  // In "mode" si inserisce la variabile "themeMode", il cui valore è determinato dall'hook "darkmode"; questo fa sì
  // che a ogni modifica di darkMode il tema venga ricreato.
  // Tema creato con il tool https://zenoo.github.io/mui-theme-creator/
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

  // Funzione di MUI per creare il tema a partire dal json fornito
  const theme = createTheme(themeOptions);
  
  return (
    <>
      {/* Creazione del tema */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Creazione dello sfondo per la nevicata */}
        {(animation && (callBackAnimation < 0)) && <SnowBackground wind={(callBackAnimation)*-1} color={!darkMode ? 'primary' : 'with'}/>}
        {/* Creazione dello sfondo per la pioggia */}
        {(animation && (callBackAnimation > 0)) && <RainBackground wind={callBackAnimation} color={!darkMode ? 'primary' : 'with'}/>}
        {/* Creazione dei due switch per le preferenze dell'utente */}
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
            {/* switch per la scelta del tipo di tema */}
            <Switch
              checked={darkMode}
              onChange={() => {
                // Cambia il valore salvato in localStorage
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
            {/* Switch per la scelta di avere o meno lo sfondo animato */}
            <Switch
              checked={animation}
              onChange={() => {
                const newAnimation = !animation;
                // Cambia il valore salvato in localStorage
                window.localStorage.setItem("prefers-animations", newAnimation.toString());
                
                setAnimation(newAnimation);
              }}
              color="default"
              />
            <MotionPhotosAutoIcon color={animation ? 'primary' : 'with'}/>
          </Box>
        </Box>
        {/* Qui viene chiamato il component Input passandogli come prop la funzione di callBack */}
        <Input callBack={(i) => {setCallBackAnimation(i)}}></Input>
      </ThemeProvider>
    </>
  )
}
