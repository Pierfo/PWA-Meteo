import React from "react";
import { useState } from "react";
import TabellaMeteo from './TabellaMeteo.jsx'


function Input2() {
    const [send , setSend] = useState(false); //variabile per far comparire la tabella
    const [input , setInput] = useState("");
    const [resend , setResend] = useState(false); //variabile per modificare la tabella
       
    return (
        <div>
            <h1>inserisci la citta</h1>
            <input name="inp" value={input} onChange={(event) => {setInput(event.target.value)}}/>
            <button onClick={() =>  {setSend(true); setResend(!resend)}}>invia</button>
            {send && <TabellaMeteo city={input} invio={resend}/>}
        </div>
        );
}

export default Input2;