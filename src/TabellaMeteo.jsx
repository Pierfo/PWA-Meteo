import { useState, useEffect } from 'react';
import {median, max, min} from 'mathjs';

//Associa una descrizione a ciascun valore restituito dall'API, secondo la sua documentazione (in fondo alla pagina https://open-meteo.com/en/docs)
function getWeatherDescription(weatherCode) {
    switch (weatherCode) {
      case 0: return "Cielo sereno";
      case 1: return "Cielo prevalentemente sereno";
      case 2: return "Parzialmente nuvoloso"
      case 3: return "Nuvoloso";
      case 45: return "Nebbia";
      case 48: return "Nebbia con brina";
      case 51: return "Lievi rovesci";
      case 53: return "Rovesci di media intensità"
      case 55: return "Rovesci intensi";
      case 56: return "Lievi rovesci di pioggia gelata";
      case 57: return "Rovesci di pioggia gelata";
      case 61: return "Pioggia lieve";
      case 63: return "Pioggia";
      case 65: return "Pioggia intensa";
      case 66: return "Lieve pioggia gelata";
      case 67: return "Pioggia gelata";
      case 71: return "Lieve nevicata";
      case 73: return "Nevicata"
      case 75: return "Nevicata intensa";
      case 77: return "Neve a granuli";
      case 80: return "Lieve acquazzone";
      case 81: return "Acquazzone";
      case 82: return "Acquazzone intenso";
      case 85: return "Lieve tempesta di neve";
      case 86: return "Tempesta di neve";
      case 95: return "Temporale";
      case 96: return "Temporale con lieve grandine";
      case 99: return "Temporale con grandine";
      default: return "Informazioni meteo non disponibili";
    }
  }

function TabellaMeteo({city, invio}){
    
    const [letturaAPI , setLetturaAPI] = useState(false); // false se la API non ha ancora letto treu se la API ha finito di leggere
    const [datiMeteo , setDatiMeteo] = useState({}); // dati restituiti dalla API
    const [errore, setErrore] = useState(""); // errore riscontrato durante la chiamata API
    const [searchResult, setSearchResult] = useState("");

    useEffect(() => {
        //Svuota la barra di ricerca
        document.getElementById("search-bar").value = "";
        
        console.log("ricarico tabella");
        setErrore("");
        setLetturaAPI(false);

        async function chiamataAPI(citta) {
            try {
                // API per estrarre le coordinate dal nome della citta
                const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(citta)}&format=jsonv2&limit=1`;
                const responsePos = await fetch(apiUrl);
                if (!responsePos.ok) {
                    setErrore("Errore HTTP");
                    throw new Error(`Errore HTTP! Stato: ${responsePos.status}`);
                }
                const data = await responsePos.json();
          
                if (!(data && data.length > 0)) {
                    setErrore("Nessun risultato trovato per la città");
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
                    setErrore("errore api meteo");
                    throw new Error(`Errore HTTP! Stato: ${response.status}`);
                }
            
                const jsonData = await response.json();
                // console.log(jsonData);
                setDatiMeteo(jsonData)  
                console.log(jsonData);
                              
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
                const result = nominatimData.address.city || nominatimData.address.town || nominatimData.address.village || 'Località sconosciuta';
                
                //stampa i risultati sulla console
                console.log("risposta API coordinate --> citta: ", result);

                if(result === "Località sconosciuta") {
                    setErrore("Città non trovata");
                    throw new Error("Città non trovata");
                }
                else {
                    //salva la città cercata in un Cookie della durata di 24 ore, così potrà ritrovare le informazioni meteo relative a 
                    //tale città al prossimo accesso
                    document.cookie = "last-searched=" + result + "; max-age=" + 24*3600 + ";"    
                    setSearchResult(result);
                }            
            } catch (error) {
                console.log("errore");
                
                ("Errore durante la chiamata API:", error);
                setErrore(error);                
            }finally {
                setLetturaAPI(true);
            }
        }

        chiamataAPI(city);
    }, [invio]);// con [] il codice viene eseguito una sola volta (anche se ri-renderizzato)

    if (errore != "") {
        return(
            <h1>{errore}</h1>
        ); 
    }
    
    if (!letturaAPI){
        return(
            <h1>Lettura dati API</h1>
        ); 
    }
    
    // console.log("oggetto js meteo ", datiMeteo);
    // return(
    //     <h1>lettura dati avvenuta</h1>
    // );


    return (
        <>
        <h1>Dati meteo per "{searchResult}"</h1>
        <h1>Precipitazioni settimana: {getWeatherDescription(median(datiMeteo.hourly.weather_code))}</h1>
        <h1>Temperature dalla settimana tra {min(datiMeteo.hourly.temperature_2m)} e {max(datiMeteo.hourly.temperature_2m)}</h1>
        <table>
          <thead>
            <tr>
              <th>Ora (UTC)</th>
              <th>Temperatura (°C)</th>
              <th>Precipitazione</th>
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