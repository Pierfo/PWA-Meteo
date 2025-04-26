import { useState, useEffect } from 'react';

function getWeatherDescription(weatherCode) {
    switch (weatherCode) {
      case 0: return "Cielo sereno";
      case 1: case 2: case 3: return "Nuvoloso";
      case 45: case 48: return "Nebbia";
      case 51: case 53: case 55: return "Pioggerella";
      case 56: case 57: return "Pioggerella gelida";
      case 61: case 63: case 65: return "Pioggia";
      case 66: case 67: return "Pioggia gelida";
      case 71: case 73: case 75: return "Neve";
      case 77: return "Grani di neve";
      case 80: case 81: case 82: return "Rovesci di pioggia";
      case 85: case 86: return "Rovesci di neve";
      case 95: return "Temporale";
      case 96: case 99: return "Temporale con grandine";
      default: return "Informazioni meteo non disponibili";
    }
  }

function TabellaMeteo({city}){
    const [letturaAPI , setLetturaAPI] = useState(false); // false se la API non ha ancora letto treu se la API ha finito di leggere
    const [datiMeteo , setDatiMeteo] = useState({}); // dati restituiti dalla API
    const [errore, setErrore] = useState(""); // errore riscontrato durante la chiamata API


    useEffect(() => {
        async function chiamataAPI(citta) {
            try {
                // API per estrarre le coordinate dal nome della citta
                const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(citta)}&format=jsonv2&limit=1`;
                const responsePos = await fetch(apiUrl);
                if (!responsePos.ok) {
                    throw new Error(`Errore HTTP! Stato: ${responsePos.status}`);
                }
                const data = await responsePos.json();
          
                if (!(data && data.length > 0)) {
                setErrore("Nessun risultato trovato per la città");
                return null; // Nessun risultato trovato per la città
                }
                const latitude = parseFloat(data[0].lat);
                const longitude = parseFloat(data[0].lon);
                console.log("risposta API citta --> coordinate ",{ latitude, longitude });
                // API per il meteo con json
                const params = {
                    "latitude": latitude,
                    "longitude": longitude,
                    "hourly": ["temperature_2m", "weather_code"],
                    "timezone": "Europe/Rome" // Imposta la tua timezone desiderata
                };
                const url = "https://api.open-meteo.com/v1/forecast";

                const response = await fetch(url + "?" + new URLSearchParams(params));
            
                if (!response.ok) {
                throw new Error(`Errore HTTP! Stato: ${response.status}`);
                }
            
                const jsonData = await response.json();
                // console.log(jsonData);
                setDatiMeteo(jsonData)                
                /*
                // API per il meteo da openmeteo
                const params = {
                    "latitude": latitude,
                    "longitude": longitude,
                    "hourly": ["temperature_2m", "weather_code"]
                  };
                const url = "https://api.open-meteo.com/v1/forecast";
                const responses = await fetchWeatherApi(url, params);
                const response = responses[0];
                const respjson = await response.json();
                const utcOffsetSeconds = response.utcOffsetSeconds();
                const timezone = response.timezone();
                const timezoneAbbreviation = response.timezoneAbbreviation();
                const latitude1 = response.latitude();
                const longitude1 = response.longitude();
                const hourly = response.hourly(); // Rimossa l'asserzione non-null (!)

                
                const weatherData = {
                hourly: {
                    time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
                    (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
                    ),
                    temperature2m: hourly.variables(0)?.valuesArray() ?? [], // Usato optional chaining e nullish coalescing
                    weatherCode: hourly.variables(1)?.valuesArray() ?? [],     // Usato optional chaining e nullish coalescing
                },
                };

                setDatiMeteo (weatherData);

                console.log("latitudine e longitudine presa da API meteo", latitude1, " ", longitude1);
                // console.log(longitude);    
                console.log("codice precicpitazione API meteo", weatherData.hourly.weatherCode[  25]);
                */
                
                //API controllo citta da posiszione
                //ottiene il nome della città usando Nominatim (geocoding inverso)
                const nominatimApiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`;
                const nominatimResponse = await fetch(nominatimApiUrl);
                const nominatimData = await nominatimResponse.json();
                
                //estrai il nome della città (potrebbe variare a seconda della precisione)
                const city = nominatimData.address.city || nominatimData.address.town || nominatimData.address.village || 'Località sconosciuta';
                
                //stampa i risultati sulla console
                console.log("risposta API coordinate --> citta: ", city);
                
            } catch (error) {
                console.error("Errore durante la chiamata API:", error);
                setErrore(error);                
            }finally {
                setLetturaAPI(true);
            }
            
            
        }

        chiamataAPI(city);
    }, []);// con [] il codice viene esseguito unasola vonta (anche se ri-renderizzato)
    
    
    if (errore != "") {
        return(
            <h1>c'è stato un errore durante la chiamate API</h1>
        ); 
    }
    
    if (!letturaAPI){
        return(
            <h1>lettura dati API</h1>
        ); 
    }
    
    // console.log("oggetto js meteo ", datiMeteo);
    // return(
    //     <h1>lettura dati avvenuta</h1>
    // );


    console.log(datiMeteo);



    return (
        <>
        <table>
          <thead>
            <tr>
              <th>Ora (UTC)</th>
              <th>Temperatura (°C)</th>
              <th>Precipitaizone</th>
            </tr>
          </thead>
          <tbody>
            {datiMeteo.hourly.time.map((t, index) => (
                <tr key={t}>
                    <td>{new Date(t).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{datiMeteo.hourly.temperature_2m[index]}</td>
                    <td>{getWeatherDescription(datiMeteo.hourly.weather_code[index])}</td>
                </tr>
                ))}
          </tbody>
        </table>
        </>
      );


}

export default TabellaMeteo;