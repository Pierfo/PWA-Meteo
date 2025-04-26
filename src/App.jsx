import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react'

function App() {
  const [count, setCount] = useState(0)

  //padova  latitudine 45°24′27.84″ nord e longitudine 11°52′24.02″ 
  const latitude = ConvertDMSToDD(45,24,27);
  const longitude = ConvertDMSToDD(11,52,24);

  //roma 41°53′57.12″ nord e longitudine 12°32′42.00″ 
  //const latitude = 41.9028;
  //const longitude = 12.4964;
  
  // getWeatherAndPrintWithCitynol(latitude, longitude);
  
  const dati = prova_get();
  console.log(dati);
  return (
    <>  
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>s</h1>
      <div className="card">
        <button onClick={() => getWeatherAndPrintWithCitynol(latitude, longitude)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

async function getWeatherAndPrintWithCitynol(latitude, longitude) {
  try {
    //ottiene i dati meteo da Open-Meteo
    const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature&hourly=temperature_2m&current=weather_code&current=rain`;
    const weatherResponse = await fetch(weatherApiUrl);//fa la richiesta e aspetta fino alla risposta
    const weatherData = await weatherResponse.json();

    const currentTemperature = weatherData.current.temperature;
    const temperatureUnit = weatherData.current_units.temperature;

    //ottiene il nome della città usando Nominatim (geocoding inverso)
    const nominatimApiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`;
    const nominatimResponse = await fetch(nominatimApiUrl);
    const nominatimData = await nominatimResponse.json();

    //estrai il nome della città (potrebbe variare a seconda della precisione)
    const city = nominatimData.address.city || nominatimData.address.town || nominatimData.address.village || 'Località sconosciuta';

    //stampa i risultati sulla console
    console.log(`Città: ${city}`);
    console.log(weatherData.current.rain);
    console.log(`Temperatura attuale: ${currentTemperature} ${temperatureUnit}`);
    console.log(weatherData);
    console.log(nominatimData);


    return "fsjdkf";


  } catch (error) {
    console.error("Errore:", error);
  }
}

async function prova_get () {
  // setcount(count+1);
  return"sfs";
}

function ConvertDMSToDD(degrees, minutes, seconds) {
  var dd = degrees + minutes/60 + seconds/(60*60);
  return dd;
}

export default App
