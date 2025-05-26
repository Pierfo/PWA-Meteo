import React from "react";
import { useState, useEffect } from "react";
import MeteoCard from "./MeteoCard.jsx";
import cities from "./cities_italy_100.json";

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import SendIcon from '@mui/icons-material/Send';

function Input2() {
    const [send , setSend] = useState(false); //variabile per far comparire la tabella
    const [resend , setResend] = useState(false); //variabile per modificare la tabella
    const [dati, setDati] = useState(""); //variabile aggiornata ogni volta che cambia nella textfield
    const [senddati, setSendDati] = useState(""); //variabile modificata solo all'invio utilizzata per evitare il ri-render dilla tabellameteo
    const [citta, setCitta] = useState([]);

    function reloadSearchedItem() {
        if(!window.localStorage.getItem("searched-item")) {
            return "";
        }

        return window.localStorage.getItem("searched-item");
    }

    //Invia all'API il nome della città
    function press() {
        if (dati.length > 2){
            setSendDati(dati);
            setSend(true); 
            setResend(!resend);   
            console.log("dal press", dati);
            window.localStorage.removeItem("searched-item");
            setDati("");   
        }
         
    }

    //Legge il nome dell'ultima città cercata salvato nel Cookie "last-searched", restituisce null se non trovato
    function getLastSearchedCity() {
        if(!document.cookie.includes("last-searched")) {
            return null;
        }

        let begin = document.cookie.indexOf('last-searched=') + 'last-searched='.length;
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

    function reloadState() {
        if(getLastSearchedCity() != null) {            
            setDati(reloadSearchedItem());
            if(getLastSearchedCity() != "none") {
                setSendDati(getLastSearchedCity());
                setSend(true); 
                setResend(!resend);      
            }
        }
    }

    useEffect(() => {
        if(isAtStartup()) {
            reloadState();
        }
        
        else {
            document.cookie = "last-searched=none; max-age=" + (24 * 3600) + ";";
            window.localStorage.removeItem("searched-item");
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
          setCitta(cities);
          return;
        }
    
        const results = cities.filter(city =>
          city.toLowerCase().startsWith(dati.toLowerCase())
        );
    
        setCitta(results.slice(0, 10)); // Mostra fino a 10 risultati
    }, [dati]);       
        
    return (
        <>
        
            <Box sx={{display: 'flex', height: 56,mt: 3, justifyContent: 'center'}}>
                <Autocomplete
                    sx={{ width: '35%' }}
                    id="search-bar"
                    value={dati}
                    type="search" 
                    freeSolo
                    options={citta.map((c) => c)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            //type="search" 
                            id="search-bar"
                            onKeyDown={handleKeyDown}
                            onChange={(e) => {
                                setDati(e.target.value);
                                window.localStorage.setItem("searched-item", e.target.value);
                            }}
                            defaultValue={window.localStorage.getItem("searced-item")}
                            autoFocus
                            label="Inserire la città"
                            variant="outlined"
                            // InputProps={{
                            //     ...params.InputProps,
                            //     endAdornment: null,
                            // }}
                        />
                    )}
                    onChange={(event, newValue) => {
                        // if (event.type === "click") {
                        if (newValue) {   
                            window.localStorage.removeItem("searched-item");
                            setSendDati(newValue);
                            setSend(true);
                            setResend(!resend);
                            setDati("");
                        }
                    }}
                />
                {/* <TextField type="search" id="search-bar" value={dati} onKeyDown={handleKeyDown} onChange={(e) => {setDati(e.target.value)}} autoFocus label="inserire la citta" variant="outlined" /> */}
                <Button sx={{ml: 1}} variant="outlined" disabled={dati.length <3} onClick={press} endIcon={<SendIcon />}>send</Button>
            </Box>
            {/* {send && <TabellaMeteo city={senddati} invio={resend}/>} */}
            {send && <MeteoCard city={senddati}/>}
        </>
    );
}

export default Input2;