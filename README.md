# Progressive Web App del Meteo

Progetto di __Pietro Puozzo__, __Pier Francsco Uliana__ ed __Enoc Ke__.

Live al sito https://pierfo.github.io/PWA-Meteo

L'app è stata sviluppata col framework __react__ https://react.dev/

I file sorgente si trovano nella cartella `/src/` mentre il codice del service worker è collocato in `/public/service-worker.js`.

Per ottenere i dati meteo, l'app fa uso dell'API __Open-meteo__ https://open-meteo.com/. Questa richiede che il nome della città sia prima tradotto nelle sue coordinate geografiche, operazione eseguita mediante l'API __openStreetMap__ https://www.openstreetmap.org/

Le icone dell'app si trovano in `public` e sono state prese da https://img.icons8.com/. Inoltre, sono stati usati i servizi https://onlinepngtools.com/add-png-background per aggiungere lo sfondo bianco ai file png e https://progressier.com/maskable-icons-editor per costruire l'icona maskable.

In caso sia trovato un bug, sfuggito in fase di testing, che compromette il funzionamento dell'app, si consiglia di andare sul browser dal quale si ha installato l'applicazione ed eliminare i dati di navigazione degli ultimi 15 minuti, così da riportare il programma allo stato precedente.