import React from "react";
import { useState } from "react";
import TabellaMeteo from './TabellaMeteo.jsx'



function Input2() {
    const [send , setSend] = useState(false); //variabile per far comparire la tabella
    const [resend , setResend] = useState(false); //variabile per modificare la tabella

    //Invia all'API il nome della città
    function press() {
        setSend(true); 
        setResend(!resend);       
    }

    //Permettiamo all'utente di avviare la ricerca anche premendo il tasto invio
    document.addEventListener("keydown", (key) => {
        if(key.code === "Enter") {
            press();
        }
    })
    

    return (
        <>
        <div>
            <h1>Inserisci la città</h1>
            <div id="search-wrap">
                <input id="search-bar" placeholder="Cerca una città" autoFocus onFocus={() => "this.select()"}/>
                {/* <button onClick={() =>  {setSend(true); setResend(!resend)}}>Cerca</button> */}
                <button id="search-button" onClick={press}></button>
            </div>
            {send && <TabellaMeteo city={document.getElementById("search-bar").value} invio={resend}/>}
        </div>
        </>
    );
}



export default Input2;