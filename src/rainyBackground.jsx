/**
 * Creazione dello fondo animato relativo alla pioggia.
 * 
 * Crea con javascript un array di gocce con grandezza e tempo di caduta randomica.
 * Con il css crea e anima le gocce utilizzando keyframe e animazioni infinite, prendendo com parametri 
 * quelli creati nell'array. Infine crea il component "react"
 */

import { Translate } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { Box, useTheme } from '@mui/material';

const RainBackground = ({wind = 0}) => {
  // Array di gocce
  const [drops, setDrops] = useState([]);
  // Prende i valori del tema (utilizzato per determinare il colore delle gocce)
  const theme = useTheme();

  // Variabile creata per monitorare variazioni nelle dimensioni dello schermo. In particolare, viene usata per 
  // modificare dinamicamente la densità delle gocce in base alla larghezza della finestra.
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // useEffect eseguito solo all'avvio per creare l'evento che gestisce la quantità di gocce al cambio della 
  // grandezza della finestra
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };handleResize

    window.addEventListener("resize", handleResize);
  }, []);  

  // useEffect eseguito a ogni modifica della grandezza dello schermo, usato per modificare dinamicamente la 
  // quantità di gocce al ridimensionamento dello shermo
  useEffect(() => {
    const width = window.innerWidth;   
    const density = 0.1; // gocce per pixel
    // Intero usato per le iterazioni del for loop
    const numDrops = Math.floor(width * density);
  
    // Crea l'array di gocce che poi sarà usato nel map
    const newDrops = [];
  
    // Crea le gocce ognuna con dimensioni spaziali e temporali diverse
    for (let i = 0; i < numDrops; i++) {
      newDrops.push({
        id: i,
        left: -wind + Math.random() * (100+wind),
        delay: Math.random() * 2,
        duration: 1 + Math.random() * 2,
        width: 2 + Math.random() * 1.5,
        height: 10 + Math.random() * 10,
      });
    }
    // Salvataggio dell'array nello useState
    setDrops(newDrops);
  }, [size]);

  return (
    <>
      <style>{`
        .rain-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
          z-index: -1;
        }

        /*css animazioni gocce*/
        .raindrop {
          position: absolute;
          top: -10%;
          background: ${theme.palette.mode === 'light' ? theme.palette.primary.main : 'rgb(255, 255, 255)'};
          border-radius: 50%;
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          }
          
        @keyframes fall {
          0% {
            transform: translateY(0) translateX(0);
            }
          100% {
            transform: translateX(0) translateY(120vh);
            }
          }

        left: 0;
        width: 100vw;
        height: 100vh;
        background: white;
        }
      `}</style>

      <div className="rain-container">
        {/* Creazione delle gocce con map */}
        {drops.map((drop) => (
          <div
          key={drop.id}
          className="raindrop"
          style={{
            // passaggio attributi dall'array randomico
            rotate: `${wind*-1}deg`,
            left: `${drop.left}%`,
            width: `${drop.width}px`,
            height: `${drop.height}px`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default RainBackground;
