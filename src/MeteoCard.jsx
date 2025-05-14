import { useState, useEffect } from 'react';
import React from 'react';
import {median, max, min} from 'mathjs';
import Skeleton from '@mui/material/Skeleton';

import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { rgbToHex, styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  WiDaySunny,
  WiDayCloudy,
  WiCloud,
  WiFog,
  WiRain,
  WiShowers,
  WiSnow,
  WiSleet,
  WiThunderstorm,
  WiDayRainMix,
  WiHail,
} from "react-icons/wi";

// funzione per tradurre in codice dato dall'api in precipitazione
function getWeatherDescription(weatherCode) {
  switch (weatherCode) {
    case 0: return "Cielo sereno";
    case 1: return "Cielo prevalentemente sereno";
    case 2: return "Parzialmente nuvoloso"
    case 3: return "Nuvoloso";
    case 45: return "Nebbia";
    case 48: return "Nebbia con brina";
    case 51: return "Lievi rovesci";
    case 53: return "Rovesci di media intensità"
    case 55: return "Rovesci intensi";
    case 56: return "Lievi rovesci di pioggia gelata";
    case 57: return "Rovesci di pioggia gelata";
    case 61: return "Pioggia lieve";
    case 63: return "Pioggia";
    case 65: return "Pioggia intensa";
    case 66: return "Lieve pioggia gelata";
    case 67: return "Pioggia gelata";
    case 71: return "Lieve nevicata";
    case 73: return "Nevicata"
    case 75: return "Nevicata intensa";
    case 77: return "Neve a granuli";
    case 80: return "Lieve acquazzone";
    case 81: return "Acquazzone";
    case 82: return "Acquazzone intenso";
    case 85: return "Lieve tempesta di neve";
    case 86: return "Tempesta di neve";
    case 95: return "Temporale";
    case 96: return "Temporale con lieve grandine";
    case 99: return "Temporale con grandine";
    default: return "Informazioni meteo non disponibili";
  }
}

// Funzione che restituisce un componente icona in base al codice meteo
function getWeatherIcon(weatherCode, size = 32) {
  switch (weatherCode) {
    case 0:
      return <WiDaySunny size={size} />;
    case 1:
    case 2:
      return <WiDayCloudy size={size} />;
    case 3:
      return <WiCloud size={size} />;
    case 45:
    case 48:
      return <WiFog size={size} />;
    case 51:
    case 53:
    case 55:
      return <WiShowers size={size} />;
    case 56:
    case 57:
      return <WiSleet size={size} />;
    case 61:
    case 63:
    case 65:
      return <WiRain size={size} />;
    case 66:
    case 67:
      return <WiSleet size={size} />;
    case 71:
    case 73:
    case 75:
    case 77:
      return <WiSnow size={size} />;
    case 80:
    case 81:
    case 82:
      return <WiDayRainMix size={size} />;
    case 85:
    case 86:
      return <WiSnow size={size} />;
    case 95:
      return <WiThunderstorm size={size} />;
    case 96:
    case 99:
      return <WiHail size={size} />;
    default:
      return <WiDaySunny size={size} />; // fallback
  }
}

// funzione che data una data restituisce giorno mese anno, usata per il giorno della card
function getDay(dataOraStringa){
  const dataOggetto = new Date(dataOraStringa);
  const anno = dataOggetto.getFullYear();
  const mese = (dataOggetto.getMonth() + 1).toString().padStart(2, '0'); // Mese è base 0
  const giorno = dataOggetto.getDate().toString().padStart(2, '0');
  return `${giorno}-${mese}-${anno}`;
}

// funzione che dalla data restituisce il giorno della settimana
function getGiornoDellaSettimana(data) {
  const dataOggetto = new Date(data);
  const giorniSettimana = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
  return giorniSettimana[dataOggetto.getDay()];
}

// component
function MeteoCard({city}){
  
  const [letturaAPI , setLetturaAPI] = useState(false); // false se la API non ha ancora letto treu se la API ha finito di leggere
  const [datiMeteo , setDatiMeteo] = useState({}); // dati restituiti dalla API
  const [errore, setErrore] = useState(""); // errore riscontrato durante la chiamata API
  const [result, setResult] = useState(""); 
  const [expanded, setExpanded] = useState(-1); // variabile usata per l'esoanzione delle card

  useEffect(() => {
    document.getElementById("search-bar").value = "";
    setErrore("");
    setLetturaAPI(false);
    async function chiamataAPI(citta) {
      try {
        console.log(city);
        
        // API per estrarre le coordinate dal nome della citta
        const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(citta)}&format=jsonv2&limit=1`;
        const responsePos = await fetch(apiUrl);
        if (!responsePos.ok) {
          throw new Error(`Errore HTTP! Stato: ${responsePos.status}`);
        }
        const data = await responsePos.json();
    
        if (!(data && data.length > 0)) {
          throw new Error("API coordinate non ha funzionato citta passata:" , city , "fine errore");
          setErrore("Nessun risultato trovato per la città");
        }
        const latitude = parseFloat(data[0].lat);
        const longitude = parseFloat(data[0].lon);
        console.log("risposta API citta --> coordinate ",{ latitude, longitude });

        // API per il meteo con json
        const params = {
          "latitude": latitude,
          "longitude": longitude,
          "hourly": ["temperature_2m", "weather_code"],
          // "models": "italia_meteo_arpae_icon_2i",
          "timezone": "Europe/Rome" // Imposta la tua timezone desiderata
        };
        const url = "https://api.open-meteo.com/v1/forecast";

        const response = await fetch(url + "?" + new URLSearchParams(params));
      
        if (!response.ok) {
          setErrore("errore api meteo");
          throw new Error(`Errore HTTP! Stato: ${response.status}`);
        }
      
        const jsonData = await response.json();
        // console.log(jsonData);
        setDatiMeteo(jsonData)  
        console.log(jsonData);
                        
        //API controllo citta da posiszione
        //ottiene il nome della città usando Nominatim (geocoding inverso)
        const nominatimApiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`;
        const nominatimResponse = await fetch(nominatimApiUrl);
        const nominatimData = await nominatimResponse.json();
          
        //estrai il nome della città (potrebbe variare a seconda della precisione)
        const city2 = nominatimData.address.city || nominatimData.address.town || nominatimData.address.village || 'Località sconosciuta';
          
        //stampa i risultati sulla console
        console.log("risposta API coordinate --> citta: ", city2);
        setResult(city2);

        if(city2 != "località sconosciuta") {
            document.cookie = "last-searched=" + city + "; max-age=" + 24*3600 + ";"
        }
            
      } catch (error) {
        console.log("errore");
          
        console.error("Errore durante la chiamata API:", error);
        setErrore(error);                
      }finally {
        setLetturaAPI(true);
      }
    }

    chiamataAPI(city);
  }, [city]);// con [] il codice viene esseguito unasola vonta (anche se ri-renderizzato)
    
    
  if (errore != "") {
    return(
      <Typography variant="h6">errore lettura api</Typography>
    ); 
  }
    
  // if (!letturaAPI){
  //   return(
  //     <Typography variant="h6">lettura dati api</Typography>
  //   ); 
  // }

  console.log("FAX");

  //funzione per l'espansione delle card
  const handleExpandClick = i => {
    setExpanded(expanded === i ? -1 : i);
  };

  // array usato per il map delle card 
  const f = [1,2,3,4,5,6,7];

  const dayNow = (new Date()).getHours();    
   
  return (
    <>
    {/* <Typography variant="h6">Dati meteo relativi alla città {city}</Typography>
    <Typography variant="h6">Precipitazioni settimana: {getWeatherDescription(median(datiMeteo.hourly.weather_code))}</Typography>
    <Typography variant="h6">Temperature dalla settimana tra {min(datiMeteo.hourly.temperature_2m)} e {max(datiMeteo.hourly.temperature_2m)}</Typography> */}

    

    <Box
      sx={{
        margin: 'auto',
        maxWidth: 400,
        display: 'box',
      }}
    >
      {/* schede oscurate mente si carica l'API */}
      {letturaAPI ? (
        f.map((g, i) =>(        
          <Card key={g} sx={{ width: 350, margin: "auto", mt: 4 }}>
            <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Typography variant="h5">{getGiornoDellaSettimana(datiMeteo.hourly.time[i*24+1 +1])}</Typography>
                <Typography variant="h6" color="text.seconi*24+1ry">{getDay(datiMeteo.hourly.time[i*24+1 +1])}</Typography>
              </Box>
              <Typography variant="h4">
                {median(taglioarraydati(datiMeteo, i*24+1,(i+1)*24).hourly.temperature_2m)}  (°C)
              </Typography>
            </CardContent>
          <CardActions disableSpacing sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
            <Box>
              {getWeatherIcon(median(taglioarraydati(datiMeteo, i*24+1,(i+1)*24).hourly.weather_code),50)}
            </Box>
            <Button
              onClick={() => handleExpandClick(i)}
              aria-expanded={expanded === i}
              aria-label="show more"
            >
              {/* <ExpandMoreIcon /> */}
              see more
            </Button>
          </CardActions>
          <Collapse in={expanded === i} timeout="auto" unmountOnExit>
            <CardContent>
              <TabellaGiorni jsonpassato={taglioarraydati(datiMeteo, i === 0 ? dayNow : i*24+1,(i+1)*24)}/>
            </CardContent>
          </Collapse>
        </Card>
      ))) : (
        f.map((g, i) =>( 
          <Skeleton
            key={i}
            variant="rectangular"
            width={350}
            height={170}
            animation="wave"
            sx={{margin: "auto", mt: 4 }}
          />
      )))}
    </Box>

    </>
  );
}

// funzione per separare i giorni della settimanda in datimeteo
function taglioarraydati(arrra, inizio, fine) {
  let taglio = JSON.parse(JSON.stringify(arrra)); // usata per non perdere l'array originale
  taglio.hourly.time = taglio.hourly.time.slice(inizio, fine); 
  taglio.hourly.temperature_2m = taglio.hourly.temperature_2m.slice(inizio, fine); 
  taglio.hourly.weather_code = taglio.hourly.weather_code.slice(inizio, fine); 
  return taglio;
}


// componet per creare la tabella partende da un json
function TabellaGiorni({jsonpassato}) {
  return(
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 300 }} aria-label="simple table">
          <TableHead>
              <TableRow>
                <TableCell>Ora</TableCell>
                <TableCell align="right">Temp (°C)</TableCell>
                <TableCell align="right">Precipitaizone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jsonpassato.hourly.time.map((t, index) => (
              <TableRow key={t}>
                <TableCell component="th" scope="row">{new Date(t).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                <TableCell align="right">{jsonpassato.hourly.temperature_2m[index]}</TableCell>
                <TableCell align="right">{getWeatherIcon(jsonpassato.hourly.weather_code[index])}</TableCell>
              </TableRow>
              ))}
            </TableBody>
        </Table>
      </TableContainer>
      </>
  );
}

export default React.memo(MeteoCard);