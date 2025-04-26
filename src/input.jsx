import React from "react";
import { useState } from "react";
import TabellaMeteo from './TabellaMeteo.jsx'


function Input2() {
    const [send , setSend] = useState(false);
    const [input , setInput] = useState("");
    
    if (!send){
        return (
            <div>
            <h1>inserisci la citta</h1>
            <input name="inp" value={input} onChange={(event) => {setInput(event.target.value)}}/>
            <button onClick={() =>  setSend(true)}></button>
        </div>
    );
    }
    else{
        console.log(input);
        return (
            <TabellaMeteo city={input} />
        );
    }
}

export default Input2;