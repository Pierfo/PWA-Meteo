import { fetchWeatherApi } from 'openmeteo';
// import React, { useEffect, useState } from 'react';
import { useState, useEffect } from 'react';



let params = {
  "latitude": 0,
  "longitude": 0,
  "hourly": ["temperature_2m", "weather_code"]
};

let modifica = 0;

const url = "https://api.open-meteo.com/v1/forecast";

export default function TestAPI({city}) {
  const [count, setCount] = useState(0);
  const [state, setState] = useState(false);


  let weatherData;
async function getWeather(cityName) {

  const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=jsonv2&limit=1`;

  try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.status}`);
      }
      const data = await response.json();


      if (data && data.length > 0) {
      const latitude = parseFloat(data[0].lat);
      const longitude = parseFloat(data[0].lon);
      console.log("risposta API citta --> coordinate ",{ latitude, longitude });
      params.latitude = latitude;
      params.longitude = longitude;
      // return { latitude, longitude };
      } else {
      return null; // Nessun risultato trovato per la città
      }
  } catch (error) {
      console.error("Errore durante la ricerca delle coordinate:", error);
      return null;
  }
  try {
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude1 = response.latitude();
    const longitude1 = response.longitude();
    const hourly = response.hourly(); // Rimossa l'asserzione non-null (!)

    weatherData = {
      hourly: {
        time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
          (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
        ),
        temperature2m: hourly.variables(0)?.valuesArray() ?? [], // Usato optional chaining e nullish coalescing
        weatherCode: hourly.variables(1)?.valuesArray() ?? [],     // Usato optional chaining e nullish coalescing
      },
    };

    

    // for (let i = 0; i < weatherData.hourly.time.length; i++) {
    //   console.log(
    //     weatherData.hourly.time[i].toISOString(),
    //     weatherData.hourly.temperature2m[i],
    //     weatherData.hourly.weatherCode[i]
    //   );
    // }

    console.log("latitudine e longitudine presa da API meteo", latitude1, " ", longitude1);
    // console.log(longitude);    
    console.log("codice precicpitazione API meteo", weatherData.hourly.weatherCode[  25]);

    
    
} catch (error) {
    console.error("Si è verificato un errore:", error);
}

try {
    //ottiene il nome della città usando Nominatim (geocoding inverso)
    const nominatimApiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${params.latitude}&lon=${params.longitude}&format=jsonv2`;
    const nominatimResponse = await fetch(nominatimApiUrl);
    const nominatimData = await nominatimResponse.json();
    
    //estrai il nome della città (potrebbe variare a seconda della precisione)
    const city = nominatimData.address.city || nominatimData.address.town || nominatimData.address.village || 'Località sconosciuta';
    
    //stampa i risultati sulla console
    console.log("risposta API coordinate --> citta: ", city);
    
} catch (error) {
    console.error("Errore:", error);
}
console.log(weatherData);
modifica = weatherData.hourly.weatherCode[2];
setState(true);
return "weatherData";
}


  useEffect(() => {
    if (count < 10) {
      getWeather(city);
    }
  }, []);

  // setCount((count) => count+1);
  // getWeather(city);
  // console.log(getWeather(city));
  // let dati = getWeather(city);
  if (state) {
    return (
      <h1>{modifica}</h1>
    );
  } else {
    return (
      <h1>{modifica}</h1>
    );
  }
  
}


