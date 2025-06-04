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
import Typography from '@mui/material/Typography';
import { FormControlLabel, Checkbox } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import useMediaQuery from '@mui/material/useMediaQuery';// Usato per prendere la grandezza dello schermo.
import { IoCloudOffline } from "react-icons/io5";
import { MdDoNotDisturb } from "react-icons/md";


import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  WiDaySunny,
  WiDayCloudy,
  WiCloudy,
  WiDayShowers,
  WiDayFog,
  WiFog,
  WiDayRain,
  WiRain,
  WiShowers,
  WiDaySnow,
  WiSnow,
  WiSnowWind,
  WiDaySnowWind,
  WiDaySleet,
  WiSleet,
  WiThunderstorm,
  WiDayRainWind,
  WiRainWind,
  WiNa,
  WiLightning,
} from "react-icons/wi";

// Funzione che fornisce una descrizione testuale del valore restituito dall'API openmeteo.
// Ha come parametro il codice formito da openmeteo e restituisce il significato in italiano del del codice.
// Es prende in input 0 e restituisce cielo sereno, i significati sono stati presi dalla documentazione.
// Link documentazione: https://open-meteo.com/en/docs?hourly=temperature_2m,weather_code.
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

// In base al risultato meteo di oggi, determina la potenza del vento nello sfondo animato.
// Valori positivi riguardano la pioggia, valori negativi la neve.
function getWeatherIntensity(weatherCode) {
  let intensity = 0;

  switch (weatherCode) {
    case 51:
    case 56:
    case 61:
    case 66:
    case 80:
      intensity = 1;
      break;

    case 53:
    case 57:
    case 63:
    case 67:
    case 81:
    case 95:
      intensity = 20;
      break;

    case 55:
    case 65:
    case 82:
    case 96:
    case 99:
      intensity = 45;
      break;

    case 71:
      intensity = -1;
      break;

    case 73:
    case 85:
      intensity = -20;
      break;

    case 75:
    case 86:
      intensity = -45;
      break;

    case 77:
      intensity = -10;
      break;

    default:
      intensity = 0;
  }
  
  return intensity;
}

// Funzione che restituisce un componente icona in base al codice meteo.
// Prende in input il codice formito da openmeteo e la grandezza dell'icona e restituisce una icona.
// presa da react icon/wi (https://react-icons.github.io/react-icons/icons/wi/).
// Es prende in input 0 e restituisce l'icona del sole essendo il cielo esereno.
function GetWeatherIcon(weatherCode, size = 32) {
  switch (weatherCode) {
    case 0: 
    case 1: return <WiDaySunny size={size} />;
    case 2: return <WiDayCloudy size={size} />;
    case 3: return <WiCloudy size={size} />;
    case 45: return <WiDayFog size={size} />;
    case 48: return <WiFog size={size} />;
    case 51: return <WiDayShowers size={size} />;
    case 53:
    case 55: return <WiShowers size={size} />;
    case 56: return <WiDaySleet size={size} />
    case 57: return <WiSleet size={size} />;
    case 61: return <WiDayRain size={size} />;
    case 63:
    case 65: return <WiRain size={size} />;
    case 66: return <WiDaySleet size={size} />;
    case 67: return <WiSleet size={size} />;
    case 71: return <WiDaySnow size={size} />;
    case 73:
    case 75:
    case 77: return <WiSnow size={size} />;
    case 80: return <WiDayRainWind size={size} />;
    case 81:
    case 82: return <WiRainWind size={size} />;
    case 85: return <WiDaySnowWind size={size} />;
    case 86: return <WiSnowWind size={size} />;
    case 95: return <WiLightning size={size} />
    case 96:
    case 99: return <WiThunderstorm size={size} />;
    default: return <WiNa size={size} />;
  }
}
  
// Funzione che, ricevuta in input una data, restituisce il numoro di giorno, mese e anno.
function getDay(dataOraStringa){
  const dataOggetto = new Date(dataOraStringa);
  const anno = dataOggetto.getFullYear();
  const mese = (dataOggetto.getMonth() + 1).toString().padStart(2, '0'); // Mese è base 0
  const giorno = dataOggetto.getDate().toString().padStart(2, '0');
  return `${giorno}-${mese}-${anno}`;
}
  
// Funzione che, dalla data, restituisce il giorno della settimana.
function getGiornoDellaSettimana(data) {
  const dataOggetto = new Date(data);
  const giorniSettimana = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
  return giorniSettimana[dataOggetto.getDay()];
}
  
// Prende il JSON proveniente da opnemeteo (passato per parametro) e crea un nuovo JSON
// contenente gli elementi dei campi "hourly":"time", "hourly":"temperature_2m" e 
// "hourly":"weather_code" compresi fra gli indici "inizio" e "fine".
function tagliojsondati(jsonOriginale, inizio, fine) {
  let jsonTagliato = JSON.parse(JSON.stringify(jsonOriginale)); // si crea una copia per non perdere l'array originale
  jsonTagliato.hourly.time = jsonTagliato.hourly.time.slice(inizio, fine); 
  jsonTagliato.hourly.temperature_2m = jsonTagliato.hourly.temperature_2m.slice(inizio, fine); 
  jsonTagliato.hourly.weather_code = jsonTagliato.hourly.weather_code.slice(inizio, fine); 
  return jsonTagliato;
}
  
// Component per creare la tabella piccola (usata quando lo schermo ha larghezza inferiore a 600px)
// partendo dal json
// La tabella piccola è piu stretta e non mostra la descrizione testuale delle precipitazioni ma solo le icone
function TabellaGiorniPiccola({jsonpassato}) {
  return(
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 300 }} aria-label="simple table">
          <TableHead>
              <TableRow>
              <TableCell sx={{fontWeight: 'bold', fontSize: 15.5}} >Ora</TableCell>
                <TableCell sx={{fontWeight: 'bold', fontSize: 15.5}} align="right">Temp (°C)</TableCell>
                <TableCell sx={{fontWeight: 'bold', fontSize: 15.5}} align="right">Precipitazione</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/*Crea le righe della tabella*/}
              {jsonpassato.hourly.time.map((t, index) => (
              <TableRow key={t}>
                <TableCell component="th" scope="row">{new Date(t).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                <TableCell align="right">{jsonpassato.hourly.temperature_2m[index]}</TableCell>
                <TableCell align="right">{GetWeatherIcon(jsonpassato.hourly.weather_code[index])}</TableCell>
              </TableRow>
              ))}
            </TableBody>
        </Table>
      </TableContainer>
      </>
  );
}
  
// Component per creare la tabella grande (usata quando la largheza dello schermo supera i 600px)
// partendo da un json 
// La tabella grande riporta anche la descrizione testuale del tempo
function TabellaGiorniGrande({jsonpassato}) {
  return(
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 300 }} aria-label="simple table">
          <TableHead>
              <TableRow>
              <TableCell sx={{fontWeight: 'bold', fontSize: 15.5}} >Ora</TableCell>
                <TableCell sx={{fontWeight: 'bold', fontSize: 15.5}} align="right">Temperatura (°C)</TableCell>
                <TableCell sx={{fontWeight: 'bold', fontSize: 15.5}} align="right">Precipitazione</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jsonpassato.hourly.time.map((t, index) => (
              <TableRow key={t}>
                <TableCell component="th" scope="row">{new Date(t).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                <TableCell align="right">{jsonpassato.hourly.temperature_2m[index]}</TableCell>
                <TableCell align="right"><Box sx={{display: "box"}}>{GetWeatherIcon(jsonpassato.hourly.weather_code[index])}<Typography>{getWeatherDescription(jsonpassato.hourly.weather_code[index])}</Typography></Box></TableCell>
              </TableRow>
              ))}
            </TableBody>
        </Table>
      </TableContainer>
      </>
  );
}

// Component principale
// city prop che indica la cittaà che l'utentne sta cercado
// callback prop per fare il callback, utilizzato per impostare lo sfondo hce cambia in base alle condizioni meteo del giorno 
function MeteoCard({city , callBack}){
    
  // Dichiarazioni degli useState
  const [errore, setErrore] = useState(""); // Errore riscontrato durante la chiamata API
  const [letturaAPI , setLetturaAPI] = useState(false); // False se la API non ha ancora letto, true se la API ha finito di leggere, usato per gli skeleton
  const [datiMeteo , setDatiMeteo] = useState({}); // Dati restituiti dalla API, qui viene salvato il json dopo aver fatto la chimata API
  const [expanded, setExpanded] = useState(-1); // Variabile usata per l'espansione delle card, assume un valore da 0 a 6 che indica quale delle sette card è stata espansa, -1 se nessuna è espanda. Facendo cosi se ne puo espandere solamente una alla volta
  const [offline, setOffline] = useState(false); // Variabile usata per registrare se l'utente è offline
  const [badSearch, setBadSearch] = useState(false); // Assume valore false se la ricerca completa con successo, true se invece la ricerca fallisce perché la città inserita non esiste
  const [favourite, setFavourite] = useState(false); // Varaibile usata per verificare se la città cercata è stata salvata come preferita
  const matches = useMediaQuery('(min-width:600px)'); // Media query per monitorare la larghezza dello schermo, serve per capire se usare la Card grande o quella piccola

  // Useffect per le chiamate API, viene eseguito ogni volta che city viene modificata
  useEffect(() => {
    // Controlla se la citta inserita è impostata come preferita
    isFavourite();
    
    // Salva l'ultima città cercata in un cookie della durata di 3 ore, cosicché l'utente possa ritrovare la sua
    // ultima ricerca alla riapertura dell'app
    document.cookie = "last-searched=" + city + "; max-age=" + 3*3600 + ";"
    
    // Senza questo il programma interpreterebbe "Roma" e "roma" come due città distinte, dunque salverebbe
    // in cache i json relativi a entrambe le città
    city = city.toLowerCase();
    
    // Reset delle variabili (usato per le chiamate API successive la prima)
    setErrore("");
    setLetturaAPI(false);
    setOffline(false); 
    setBadSearch(false);

    // Esegue le chiamate API per la città cercata. È stato necessario creare la funzione come "async"
    // per poter usare la keyword "await"
    async function chiamataAPI(citta) {
      try {
        // Per capire se inoltrare la richiesta al server placeholder oppure all'API openstreetmap
        let placeholderSearch = false;

        if(city.endsWith("-p")) {
          placeholderSearch = true;
        }
        
        // Indirizza la richiesta alle API openMeteo e openstreetmap
        if(!placeholderSearch) {
          // Invia il nome della città all'API openstreetmap per convertirla in coordinate geografiche
          // da usare in openmeteo
          const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(citta)}&format=jsonv2&limit=1`;
          const responsePos = await fetch(apiUrl);

          // Una risposta non andata a buon fine viene interpretata come assenza di connessione a
          // internet, dato che questo è il caso più probabile 
          if (!responsePos.ok) {
            setOffline(true);
            throw new Error(`Errore HTTP! Stato: ${responsePos.status}`);
          }

          // Estrazione del json dalla response
          const data = await responsePos.json();
        
          // Se la città cercata non esiste allora la fetch ha succeso ma si verifica questa condizione
          if (!(data && data.length > 0)) {
            setErrore("Nessun risultato trovato per la città");
            setBadSearch(true);
            throw new Error("API coordinate non ha funzionato citta passata:" , city , "fine errore");
          }

          // Salvataggio latitudine e longitudine per poi usarla nell'API openmeteo 
          const latitude = parseFloat(data[0].lat);
          const longitude = parseFloat(data[0].lon);

          // Crea un json a supporto della chimata a openmeteo
          const params = {
            "latitude": latitude,
            "longitude": longitude,
            "hourly": ["temperature_2m", "weather_code"],
            "timezone": "Europe/Rome"
          };
          const url = "https://api.open-meteo.com/v1/forecast";

          // Esegue la chiamata a openmeteo
          const response = await fetch(url + "?" + new URLSearchParams(params));
        
          // Una risposta non andata a buon fine viene interpretata come assenza di connessione a
          // internet, dato che questo è il caso più probabile 
          if (!response.ok) {
            setOffline(true);
            setErrore("errore api meteo");
            throw new Error(`Errore HTTP! Stato: ${response.status}`);
          }

          // Estrae il JSON
          const jsonData = await response.json();
          setDatiMeteo(jsonData)  
        }

        // Inoltra la richiesta al server placeholder
        else {
          // Richiede dal server placeholder il file contenente la lista di tutte le città salvate al suo interno
          const contents = await fetch("https://pierfo.github.io/Dummy_data/contents.json");

          // Se la richiesta ha fallito è perché l'utente è offline
          if(!contents.ok) {
            setOffline(true);
            setErrore("Offline");
            throw new Error(`Errore HTTP! Stato: ${response.status}`);
          }

          const contentsJSON = await contents.json();

          // Se la città cercata non è inclusa nel server placeholder allora la ricerca fallisce
          if(!contentsJSON.includes(`${citta.substring(0, citta.lastIndexOf(" "))}.json`)) {
            setBadSearch(true);
            setErrore("Città non salvata nel server placeholder");
            throw new Error(`Città non salvata nel server placeholder`);
          }
          
          // Esegue la richiesta al server placeholder
          const response = await fetch(
            `https://pierfo.github.io/Dummy_data/openmeteo/${encodeURIComponent(
              citta.substring(0, citta.lastIndexOf(" "))
              )}.json`
          );
        
          // Se la risorsa non è stata trovata è perché l'utente è offline
          if (!response.ok) {
            setOffline(true);
            setErrore("errore api meteo");
            throw new Error(`Errore HTTP! Stato: ${response.status}`);
          }

          // Estrae il JSON
          const jsonData = await response.json();
          setDatiMeteo(jsonData)
        }
            
      } catch (error) {
        setErrore(error); 
        console.error(error)               
      }finally{
        // Le API hanno terminato
        setLetturaAPI(true);
      }
    }

    chiamataAPI(city);
  }, [city]); // Questo useEffect viene chiamato solo quando viene modificato city 
    
  // useEffect eseguito a ogni chiamata (o meglio alla di "letturaAPI" che avviene a ogni nuova chimata).
  // Ogni volta che finisce una chiamata API chiama la funzione "callback" per inviare a "theme" 
  // la condizione meteo, che viene usata per modificare lo sfondo.
  // Le informazioni meteo di interesse alla callback sono se piove o nevica e con che intensità, così
  // da poter scegliere quale sfondo applicare e che intensità fornire al vento
  useEffect(()=>{
    if(letturaAPI && !offline && !badSearch) {  
      // Viene estratto il valore mediano di weather_code e interpretato per capire l'intensità della pioggia (valore positivo) o  della neve ()valore negativo
      callBack(getWeatherIntensity(median(tagliojsondati(datiMeteo, 1,24).hourly.weather_code)));
    }
    else{
      // Altrimenti vinelimpostato a 0 (corrispone a nessuno sfondo)
      callBack(0);
    }
  }, [letturaAPI])// useEffect che viene eseguito a ogni modifica di lettudaletturaAPI
  
  // Funzione per segnalare all'utente gli arrori durante le chiamate API 
  if (errore != "") {
    if(offline) {
      return(
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3}}>
          <Typography sx={{textAlign: "center", mr: "17px"}} variant="h5">Connessione a internet assente</Typography>
          <IoCloudOffline size={30} sx={{ml: "10px"}} />
        </Box>
      );
    }
    
    return(
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3}}>
        <Typography sx={{textAlign: "center", mr: "17px"}} variant="h5">Nessun risultato trovato per "{city}"</Typography>
        <MdDoNotDisturb size={30} sx={{ml: "10px"}} />
      </Box>
    ); 
  }

console.log("FAX");

  // Funzione per comunicare quale Card è stata espansa
  // Usate nell'onclick del bottone della card 
  const handleExpandClick = i => {
    setExpanded(expanded === i ? -1 : i);
  };

  // Array usato per il map delle card e per assegnarli un id essenziale per l'espanzione 
  const f = [1,2,3,4,5,6,7];

  
  const dayNow = (new Date()).getHours();
  
  // Component per la creazione delle card piccole, per quando la larghezza dello schermo è minore di 600px
  // Oltre alle card è anche contenuta la citta che è stata cercata e il relativo checkbox per salvare la citta come preferita 
  function SmallCard() {
    return(
      <>
      {/* Operatore ternatio per gli skeleton per comunicare che la chimata API è in corso ma non ancora terminata */}
      <Box sx={{marginTop: 3}}>
        {letturaAPI ? (
          <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Typography sx={{textAlign: "center"}} variant="h5">Dati meteo relativi alla città {city}</Typography>
          <FormControlLabel sx={{ml: 1}} control={
            <Checkbox checked={favourite} onChange={changeFavourite} icon={<FavoriteBorder />} checkedIcon={<Favorite />}/>
          }/>
          </Box>
        ) : (
          <Skeleton
            variant="rectangular"
            width={350}
            height={32}
            animation="wave"
            sx={{margin: "auto", borderRadius: 2}}
          />
        )}
      </Box>
      

      <Box
        sx={{
          margin: 'auto',
          maxWidth: 400,
          display: 'box',
        }}
      >
        {/* Operatore ternatio per gli skeleton per comunicare che la chimata API  è in corso ma non ancora terminata */}
        {letturaAPI ? (
          f.map((g, i) =>(        
            <Card key={g} sx={{ width: 350, margin: "auto", mt: 4 }}>
              <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="h5">{getGiornoDellaSettimana(datiMeteo.hourly.time[i*24+1 +1])}</Typography>
                  <Typography variant="h6" color="text.seconi*24+1ry">{getDay(datiMeteo.hourly.time[i*24+1 +1])}</Typography>
                </Box>
                <Typography variant="h4">
                  {median(tagliojsondati(datiMeteo, i*24+1,(i+1)*24).hourly.temperature_2m)}  (°C)
                </Typography>
              </CardContent>
            <CardActions disableSpacing sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
              <Box>
                {GetWeatherIcon(median(tagliojsondati(datiMeteo, i*24+1,(i+1)*24).hourly.weather_code),50)}
              </Box>
              <Button
                onClick={() => handleExpandClick(i)}
                aria-expanded={expanded === i}
                aria-label="show more"
              >
                {/* <ExpandMoreIcon sx={{rotate: "180deg"}} /> */}
                {expanded === i ? <ExpandMoreIcon sx={{rotate: "180deg", transform: 'scale(1.3)'}}/> : <ExpandMoreIcon sx={{rotate: "0deg", transform: 'scale(1.3)'}} size={100} />}
                {/* see more */}
              </Button>
            </CardActions>
            <Collapse in={expanded === i} timeout="auto" unmountOnExit>
              <Box height={300} overflow={'scroll'}>
                <CardContent>
                  <TabellaGiorniPiccola jsonpassato={tagliojsondati(datiMeteo, i === 0 ? dayNow : i*24+1,(i+1)*24)}/>
                </CardContent>
              </Box>
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
              sx={{margin: "auto", mt: 4, borderRadius: 2}}
            />
        )))}
      </Box>

      </>
    );
  }

  // Component per la creazione delle Card grandi, per quando la larghezza dello schermo è minore di 600px
  // Oltre alle card è anche contenuta la citta che è stata cercata e il relativo checkbox per salvare la citta come preferita 
  function BigCard() {
    return(
      <>
      <Box sx={{marginTop: 3}}>
        {/* Operatore ternatio per gli skeleton per comunicare che la chimata API  è in corso ma non ancora terminata */}
        {letturaAPI ? (
          <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Typography sx={{textAlign: "center"}} variant="h5">Dati meteo relativi alla città {city}</Typography>
          <FormControlLabel sx={{ml: 1}} control={
            <Checkbox checked={favourite} onChange={changeFavourite} icon={<FavoriteBorder />} checkedIcon={<Favorite />}/>
          }/>
          </Box>
        ) : (
          <Skeleton
            variant="rectangular"
            width={350}
            height={32}
            animation="wave"
            sx={{margin: "auto", borderRadius: 2}}
          />
        )}
      </Box>
      

      <Box
        sx={{
          margin: 'auto',
          maxWidth: 550,
          display: 'box',
        }}
      >
        {/* Operatore ternatio per gli skeleton per comunicare che la chimata API  è in corso ma non ancora terminata */}
        {letturaAPI ? (
          f.map((g, i) =>(        
            <Card key={g} sx={{ width: 550, margin: "auto", mt: 4 }}>
              <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="h5">{getGiornoDellaSettimana(datiMeteo.hourly.time[i*24+1 +1])}</Typography>
                  <Typography variant="h6" color="text.seconi*24+1ry">{getDay(datiMeteo.hourly.time[i*24+1 +1])}</Typography>
                </Box>
                <Typography variant="h4">
                  {median(tagliojsondati(datiMeteo, i*24+1,(i+1)*24).hourly.temperature_2m)}  (°C)
                </Typography>
              </CardContent>
            <CardActions disableSpacing sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
              <Box sx={{display: 'flex'}}>
                {GetWeatherIcon(median(tagliojsondati(datiMeteo, i*24+1,(i+1)*24).hourly.weather_code),50)}
                <Typography sx={{margin: 'auto', ml: 1}} variant='h6'>{getWeatherDescription(median(tagliojsondati(datiMeteo, i*24+1,(i+1)*24).hourly.weather_code),50)}</Typography>
              </Box>
              <Button
                onClick={() => handleExpandClick(i)}
                aria-expanded={expanded === i}
                aria-label="show more"
              >
                {/* <ExpandMoreIcon sx={{rotate: "180deg"}} /> */}
                {expanded === i ? <ExpandMoreIcon sx={{rotate: "180deg", transform: 'scale(1.3)'}}/> : <ExpandMoreIcon sx={{rotate: "0deg", transform: 'scale(1.3)'}} size={100} />}
                {/* see more */}
              </Button>
            </CardActions>
            <Collapse in={expanded === i} timeout="auto" unmountOnExit>
              <Box height={400} overflow={'scroll'}>
                <CardContent>
                  <TabellaGiorniGrande jsonpassato={tagliojsondati(datiMeteo, i === 0 ? dayNow : i*24+1,(i+1)*24)}/>
                </CardContent>
              </Box>
            </Collapse>
          </Card>
        ))) : (
          f.map((g, i) =>( 
            <Skeleton
              key={i}
              variant="rectangular"
              width={550}
              height={170}
              animation="wave"
              sx={{margin: "auto", mt: 4, borderRadius: 2}}
            />
        )))}
      </Box>

      </>
    );
  }

  // Verifica se la città cercata è stata salvata come preferita e modifica l'hook "favourite" in base al risultato
  function isFavourite() {
    const savedCity = window.localStorage.getItem("favourite-city");
    
    setFavourite((savedCity != null) && (savedCity.toLowerCase() === city.toLowerCase()));
  }

  // Riscrive il nome della città in modo tale che ciascuna parola inizi con la lettera maiuscola,
  // serve per il salvataggio della città nella entry "favourite-city" in localStorage
  function capitalize(name) {
    let capitalized = "";

    const words = name.split(" ");

    words.map((word) => {
      capitalized += (word.at(0).toUpperCase() + word.toLowerCase().substring(1, word.length) + " ");
    })

    return capitalized.substring(0, capitalized.length - 1)
  }
  

  // Se la città cercata non è la città preferita, la salva come tale; altrimenti la rimuove
  function changeFavourite() {
    if(favourite) {
      window.localStorage.removeItem("favourite-city");
    }
    else {
      window.localStorage.setItem("favourite-city", capitalize(city.toLowerCase()));
    }
    setFavourite(!favourite);
  }

  return (
    <>
      {/*Restituisce BigCard o SmallCard in base al risultato della mediaQuery*/}
      {matches ? <BigCard/> : <SmallCard/>}
    </>
  );
}

export default React.memo(MeteoCard);