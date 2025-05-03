import React from "react";
import { useState } from "react";
import TabellaMeteo from './TabellaMeteo.jsx'

function Input2() {
    const [send , setSend] = useState(false); //variabile per far comparire la tabella
    const [resend , setResend] = useState(false); //variabile per modificare la tabella
    const [input, setInput] = useState(""); //variabile per modificare l'input
    
    //Evento che viene lanciato nel momento in cui si avvia una ricerca
    const searchEvent = new Event("search");

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

    //Se è presente il Cookie e se l'utente ha appena cominciato a usare l'app allora carica l'ultima città cercata
    if((getLastSearchedCity() != null) && isAtStartup()) {
        press(getLastSearchedCity());       
    }

    //Invia all'API il nome della città "c"
    function press(c) {
        setSend(true); 
        setResend(!resend); 
        setInput(c);     
    }

    //Permettiamo all'utente di avviare la ricerca anche premendo il tasto invio
    document.addEventListener("keydown", (key) => {
        if(key.code === "Enter") {
            document.dispatchEvent(searchEvent);
        }
    })

    //Cosa eseguire in risposta a un evento "search"
    document.addEventListener("search", () => {
        press(document.getElementById("search-bar").value);
    })    

    return (
        <>
        <div>
            <h1>Inserisci la città</h1>
            <div id="search-wrap">
                <input type="text" id="search-bar" placeholder="Cerca una città" autoFocus onFocus={() => "this.select()"}/>
                <button id="search-button" onClick={() => document.dispatchEvent(searchEvent)}></button>
            </div>
            {send && <TabellaMeteo city={input} invio={resend}/>}
        </div>
        </>
    );
}



export default Input2;