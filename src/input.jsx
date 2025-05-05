import React from "react";
import { useState, useEffect } from "react";
import TabellaMeteo from './TabellaMeteo.jsx'
import cities from "./cities_italy_1000.json";

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function Input2() {
    const [send , setSend] = useState(false); //variabile per far comparire la tabella
    const [resend , setResend] = useState(false); //variabile per modificare la tabella
    const [dati, setDati] = useState(""); //variabile aggiornata ogni volta che cambia nella textfield
    const [senddati, setSendDati] = useState(""); //variabile modificata solo all'invio utilizzata per evitare il ri-render dilla tabellameteo
    const [citta, setCitta] = useState([]);
    //Invia all'API il nome della città
    function press() {
        console.log(dati);
        setSendDati(dati);
        setSend(true); 
        setResend(!resend);       
    }

    //Legge il nome dell'ultima città cercata salvato nel Cookie "last-searched", restituisce null se non trovato
    function getLastSearchedCity() {
        if(!document.cookie) {
            return null;
        }

        let begin = document.cookie.indexOf('=') + 1;
        return document.cookie.substring(begin);
    }

    //Verifica se ci si trova all'inizio della sessione di utilizzo dell'app
    function isAtStartup() {
        if(!window.sessionStorage.getItem("session")) {
            //Salvo un dato in sessionStorage: se l'utente ricarica la pagina allora il dato è conservato e perciò la funzione restituirà false
            window.sessionStorage.setItem("session", "active");
            return true;
        }

        return false;
    }

    useEffect(() => {
        //Se è presente il Cookie e se l'utente ha appena cominciato a usare l'app allora carica l'ultima città cercata
        if((getLastSearchedCity() != null) && isAtStartup()) {            
            setSendDati(getLastSearchedCity());
            setSend(true); 
            setResend(!resend);       
        }
    }, []);

    //In react è preferibile aggiungere un listener per l'imput da tastiera in questo modo anziché con 
    //addEventListener("keydown") in quanto la seconda soluzione causa l'aggiunta di un nuovo listener 
    //a ogni render della pagina
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            press();
        }
    };

    useEffect(() => {
        if (dati.length < 1) {
          setCitta([]);
          return;
        }
    
        const results = cities.filter(city =>
          city.toLowerCase().startsWith(dati.toLowerCase())
        );
    
        setCitta(results.slice(0, 10)); // Mostra fino a 10 risultati
      }, [dati]);

    return (
        <>
            <Box sx={{display: 'flex', width: 900, height: 56, margin: '0 auto', justifyContent: 'center'}}>
                <TextField type="search" id="search-bar" value={dati} onKeyDown={handleKeyDown} onChange={(e) => {setDati(e.target.value)}} autoFocus label="inserire la citta" variant="outlined" />
                <Button variant="outlined" onClick={press}>invio</Button>
            </Box>
            <ul className="border mt-2 rounded shadow bg-white">
                {citta.map((city, index) => (
                <li key={index} className="p-2 hover:bg-gray-100 cursor-pointer">
                {city}
                </li>
                ))}
            </ul>
            {send && <TabellaMeteo city={senddati} invio={resend}/>}
        </>
    );
}

export default Input2;