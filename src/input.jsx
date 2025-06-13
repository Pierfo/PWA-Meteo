/**
 * Gestisce gli aspetti relativi alla pagina iniziale dell'app, quali la barra di ricerca, il caricamento 
 * dello stato precedentemente salvato e il caricamento dei dati relativi alla città preferita.
 * 
 * All'avvio dell'app, cerca in memoria eventuali componenti dello stato da caricare: in particolare, verifica se 
 * è presente in localStorage la entry "searched-item" (che salva il testo contenuto nella barra di ricerca prima
 * che l'utente uscisse dall'app l'ultima volta) e, in caso affermativo, carica il contenuto nella barra di 
 * ricerca; poi verifica se è ancora attivo il cookie "last-searched" e, in tal caso, avvia la ricerca della città
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
// una volta inserita una città, avvia la ricerca e la visualizzazione invocando il component MeteoCard
function Input({callBack}) {

    // Variabile per far comparire le Card la prima volta
    const [send , setSend] = useState(false); 
    // Variabile per segnalare la modifica della città mandata a MeteoCard e, di conseguenza, modificare le Card
    const [resend , setResend] = useState(false); 
    // Variabile aggiornata ogni volta che cambia il contenuto della TextField
    const [dati, setDati] = useState(""); 
    // Variabile che sarà passata come prop a meteocard, contiene la città che l'utente vuole cercare
    const [senddati, setSendDati] = useState(""); 
    // Array usato per salvare le città utilizzate nell'autocomplete
    const [citta, setCitta] = useState([]); 
    // Serve per quando l'utente seleziona un opzione dal menù senza aver digitato niente sulla barra di ricerca: senza questo allora il nome della città comparirebbe nella barra di ricerca
    const [reset, setReset] = useState(false); 
    // Serve perché il contenuto della barra di ricerca non sia cancellato quando si sta tentando di ricaricare lo stato
    let dont_delete = false;

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

    // Avvia il caricamento dei dati meteo relativi alla città cercata.
    // Funzione passata come prop (attribute) all'onClick del button "send". 
    // La funzione viene anche eseguita se si preme il tasto invio sulla tastiera.
    function press() {
        // Se l'utente ha inserito almeno 3 caratteri nella barra di ricerca
        if (dati.length > 2){
            // L'input viene pulito da spazi superflui e assegnato allo useState che poi sara passato come prop a MeteoCard
            setSendDati(dati.trim());
            // Se è la prima città cercata vine attivato il component MeteoCard
            setSend(true); 
            // useState utilizzato per rieseguire le chiamate API in MeteoCard
            setResend(!resend); 
            // Ripulisce il contenuto della barra di ricerca  
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

    // Carica lo stato dell'app: in particolare, carica eventuali stringhe di testo prresenti nella barra di ricerca
    // l'ultima volta che l'utente è uscito dall'app e invia la richiesta per ottenere i dati meteo relativi all'ultima 
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
            dont_delete = true;
            reloadState();
        }
        
        else {
            document.cookie = "last-searched=none; expires=" + new Date(1970, 0, 1).toUTCString() + ";";
            window.localStorage.removeItem("searched-item");
            loadFavourite();
        }
    }, []);

    // Avvia la ricerca della città quando l'utente preme il tasto invio.
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            press();
        }
    };

    // useEffect utilizzato per prendere le città dal json "cities_italy_100.json".
    // Utilizzato per l'autocompletamento della ricerca, viene rieseguito ogni volta che "dati" subisce una modifica
    useEffect(() => {
        // Se l'utente non ha ancora digitato niente allora mostra tutte le città
        if (dati.length < 1) {
          setCitta(cities);
          return;
        }
    
        // Tra le 100 città vengono selezionate tutte quelle che cominciano con "dati" 
        const results = cities.filter(city =>
          city.toLowerCase().startsWith(dati.toLowerCase())
        );

        // Delle città selezionate ne vengono mostrate fino a 10 e vengono salvate nello useState citta
        setCitta(results.slice(0, 10)); 
    }, [dati]);       

    // Svuota il contenuto della barra di ricerca quando l'utente ha selezionato una città del menù senza aver digitato niente
    useEffect(() => {
        if(!dont_delete) {
            modifyText("")
        }
        else {
            dont_delete = false;
        }      
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