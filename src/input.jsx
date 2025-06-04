/**
 * Gestisce gli aspetti relativi alla pagina iniziale dell'app, quali la barra di ricerca, il caricamento 
 * dello stato precedentemente salvato e il caricamento dei dati relativi alla città preferita.
 * 
 * All'avvio dell'app, cerca in memoria eventuali componenti dello stato da caricare: in particolare, verifica se 
 * è presente in localStorage la entry "searched-item" (che salva il testo contenuto nella barra di ricerca prima
 * che l'utente uscisse dall'app l'ultima volta) e, in caso affermativo, carica il contenuto nella barra di 
 * ricerca; poi verifica se è ancora attivo il cookie "last-searched" e in tal caso avvia la ricerca della città
 * salvata in quest'ultimo, altrimenti avvia la ricerca della città salvata come preferita (contenuta nella entry
 * "favourite-city" di localStorage), se presente.
 * 
 * Quando l'utente ricarica la pagina, invece, carica i dati meteo relativi all'eventuale città preferita.
 * 
 * La componente si occupa anche di inoltrare la città inserita dall'utente nella barra di ricerca a MeteoCard, il
 * quale effettua le opportune chiamate API per caricare i relativi dati meteo.
 */

import React from "react";
import { useState, useEffect } from "react";
import MeteoCard from "./MeteoCard.jsx";
import cities from "./cities_italy_100.json"; //json per l'autocompletamento delle città
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import SendIcon from '@mui/icons-material/Send';

// Component principale usato per la ricerca, contiene l'autocomplete, il pulsante di invio e,
// una volta inserita una città, fa partire la ricerca e la visualizzazione invocando il component meteocard
function Input({callBack}) {

    // Dichiarazioni degli useState
    const [send , setSend] = useState(false); // Variabile per far comparire la tabella la prima volta
    const [resend , setResend] = useState(false); // Variabile per segnalare la modifica della città mandata a meteocard e di conseguenza modificare le card
    const [dati, setDati] = useState(""); // Variabile aggiornata ogni volta che cambia il contenuto della textfield
    const [senddati, setSendDati] = useState(""); // Variabile che sarà passata come prop a meteocard, rappresenta la città che l'utente vuole cercare
    const [citta, setCitta] = useState([]); // Array usato per salvare le città utilizzate nell'autocomplete
    const [reset, setReset] = useState(false); // Serve per quando l'utente seleziona un opzione dal menù senza aver digitato niente sulla barra di ricerca: senza questo allora il nome della città comparirebbe nella barra di ricerca

    // Avvia il caricamento dei dati meteo relativi alla città salvata come preferita, se presente
    function loadFavourite() {
        if(!window.localStorage.getItem("favourite-city")) {
            return;
        }

        setSendDati(window.localStorage.getItem("favourite-city"));
        setSend(true); 
        setResend(!resend);
    }
    
    // Se l'utente ha chiuso l'app lasciando del testo nella barra di ricerca, ricarica quest'ultimo al prossimo 
    // avvio dell'app
    function reloadSearchedItem() {
        if(!window.localStorage.getItem("searched-item")) {
            return "";
        }

        return window.localStorage.getItem("searched-item");
    }

    // Avvia il caricamento dei dati meteo relativi alla città cercata
    // Funzione passata come prop (attribute) all'on click del button "send" 
    // La funzione viene anche eseguita se si preme il tasto invio sulla tastiera 
    function press() {
        // Se l'utente ha inserito almeno 3 caratteri nella barra di ricerca
        if (dati.length > 2){
            // L'input vine pulto da spazi superflui e assegnato allo useState che poi sara passato come prop a MeteoCard
            setSendDati(dati.trim());
            // se è la prima citta cercata vine ativato il component meteocard
            setSend(true); 
            // useState utilizzato per rieseguire le chiamate API in meteocard
            setResend(!resend);   
            modifyText(""); 
        }
         
    }

    // Legge il nome dell'ultima città cercata salvato nel Cookie "last-searched", restituisce null se non trovato
    function getLastSearchedCity() {
        if(!document.cookie.includes("last-searched")) {
            return null;
        }

        let begin = document.cookie.indexOf('last-searched=') + 'last-searched='.length;
        return document.cookie.substring(begin);
    }

    // Sfrutta sessionStorage per verificare se ci si trova all'inizio della sessione di utilizzo dell'app
    function isAtStartup() {
        if(!window.sessionStorage.getItem("session")) {
            // Salvo un dato in sessionStorage: se l'utente ricarica la pagina allora il dato rimane e perciò la
            // funzione restituirà false
            window.sessionStorage.setItem("session", "active");
            return true;
        }

        return false;
    }

    // Sostituisce il contenuto della barra di ricerca con la stringa "text" e la salva nello stato dell'app
    function modifyText(text) {
        setDati(text);

        if(text === "") {
            window.localStorage.removeItem("searched-item");
        }

        else {
            window.localStorage.setItem("searched-item", text);
        }
    }

    // Carica lo stato dell'app: in particolare, carica il contenuto della barra di ricerca precedente all'ultima
    // volta che l'utente è uscito dall'app e invia la richiesta per ottenere i dati meteo relativi all'ultima 
    // città cercata. Se quest'ultima non è definita allora ottiene i dati meteo per l'eventuale città preferita
    function reloadState() {          
        modifyText(reloadSearchedItem());
        if(getLastSearchedCity() != null) {
            setSendDati(getLastSearchedCity());
            setSend(true); 
            setResend(!resend);      
        }

        else {
            loadFavourite();
        }
    }

    // Se si sta avviando l'app ricarica lo stato, se, invece, si sta ricaricando la pagina, carica la città preferita
    useEffect(() => {
        if(isAtStartup()) {
            reloadState();
        }
        
        else {
            document.cookie = "last-searched=none; expires=" + new Date(1970, 0, 1).toUTCString() + ";";
            window.localStorage.removeItem("searched-item");
            loadFavourite();
        }
    }, []);

    // Avvia la ricerca della città quando l'utente preme il tasto invio
    //
    // In react è preferibile aggiungere un listener per l'input da tastiera in questo modo anziché con 
    // addEventListener("keydown") in quanto la seconda soluzione causa l'aggiunta di un nuovo listener 
    // a ogni render della pagina
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            press();
        }
    };

    // useEffect utilizzato per prendere le città dal json "cities_italy_100.json".
    // Utilizzato per l'autocompletamento della ricerca, viene rieseguito ogni volta che "dati" subisce una modifica
    useEffect(() => {
        if (dati.length < 1) {
          setCitta(cities);
          return;
        }
    
        // tra le 100 città vengono selezionate tutte quelle che cominciano con "dati" 
        const results = cities.filter(city =>
          city.toLowerCase().startsWith(dati.toLowerCase())
        );

        // Delle città selezionate ne vengono mostrate fino a 10
        // e vengono salvate nello useState citta
        setCitta(results.slice(0, 10)); 
    }, [dati]);       

    // Svuota il contenuto della barra di ricerca quando l'utente ha digitato un opzione del menù senza aver digitato niente
    useEffect(() => {
        modifyText("");        
    }, [reset])
        
    return (
        <>
            <Box sx={{display: 'flex', height: 56,mt: 8, justifyContent: 'center'}}>
                {/* Barra di ricerca */}
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
                            id="search-bar"
                            onKeyDown={handleKeyDown}
                            onChange={(e) => {
                                // Per quando l'utente inserisce caratteri sulla barra di ricerca
                                modifyText(e.target.value);
                            }}
                            autoFocus
                            label="Inserire la città"
                            variant="outlined"
                        />
                    )}
                    onChange={(event, newValue) => {
                        // Per quando l'utente seleziona una città dal menù
                        if (newValue) {   
                            setSendDati(newValue);
                            setSend(true);
                            setResend(!resend);
                            setDati(" ");
                            setReset(!reset);
                        }

                        // Per quando l'utente ripulisce la barra di ricerca premendo la X
                        else {
                            modifyText("");
                        }
                    }}
                    
                />
                {/* Pulsante "send"*/}
                <Button sx={{ml: 1}} variant="outlined" disabled={dati.length <3} onClick={press} endIcon={<SendIcon />}>send</Button>
            </Box>
            {send && <MeteoCard city={senddati} callBack={callBack}/>}
        </>
    );
}

export default Input;