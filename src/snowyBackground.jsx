/**
 * Creazione dello fondo animato relativo alla neve.
 * 
 * Crea con javascript un array di fiocchi di neve con grandezza e tempo di caduta randomica.
 * Con il css crea e anima i fiocchi di neve utilizzando keyframe e animazioni infinite, prendendo com parametri 
 * quelli creati nell'array. Infine crea il component "react"
 */

import { Translate } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { Box, useTheme } from '@mui/material';

const SnowBackground = ({wind = 0}) => {
  // Array di fiocchi di neve
  const [drops, setDrops] = useState([]);
  // Prende i valori del tema (utilizzato per determinare il colore dei fiocchi di neve)
  const theme = useTheme();

  // Variabile creata per monitorare variazioni nelle dimensioni dello schermo. In particolare, viene usata per 
  // modificare dinamicamente la densità dei fiocchi di neve in base alla larghezza della finestra.
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // useEffect eseguito solo all'avvio per creare l'evento che gestisce la quantità di fiocchi di neve al cambio 
  // della grandezza della finestra
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
  }, []);  

  // useeffect eseguito a ogni modifica della grandezza dello schermo, usato per modificare dinamicamente la 
  // quantità di fiocchi di neve al ridimensionamento dello shermo
  useEffect(() => {
    const width = window.innerWidth; 
    const density = 0.1; // fiocchi di neve per pixel
    // Intero usato per le iterazioni del for loop
    const numDrops = Math.floor(width * density);
  
    // Crea l'array di fiocchi di neve che poi sarà usato nel map
    const newDrops = [];

    // Crea i fiocchi di neve ognuno con dimensioni spaziali e temporali diverse
    for (let i = 0; i < numDrops; i++) {
      newDrops.push({
        id: i,
        left: -wind + Math.random() * (100+wind),
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 5,
        size: 2 + Math.random() * 4,
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
        {/* Creazione dei fiocchi di neve con map */}
        {drops.map((drop) => (
          <div
          key={drop.id}
          className="raindrop"
          style={{
            // passaggio attributi dall'array randomico
            rotate: `${wind*-1}deg`,
            left: `${drop.left}%`,
            width: `${drop.size}px`,
            height: `${drop.size}px`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default SnowBackground;
