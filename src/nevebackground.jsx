import { Translate } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { Box, useTheme } from '@mui/material';


const SnowBackground = ({wind = 0}) => {
  //array 
  const [drops, setDrops] = useState([]);
  const theme = useTheme();

  //fatto per un saso particolare in cui l'app viene avviata con una grandezza e poi la cambia 
  //quindi usata per modificare dinamicamente la densita delle gocce in base alla larghezza della finestra
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);  

  useEffect(() => {
    const width = window.innerWidth;
    console.log(width);
    
    const density = 0.1; // gocce per pixel
    const numDrops = Math.floor(width * density);
  
    //creo l'array di gocce che poi sarausato nel map
    const newDrops = [];
  
    for (let i = 0; i < numDrops; i++) {
      newDrops.push({
        id: i,
        left: -wind + Math.random() * (100+wind),
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 5,
        size: 2 + Math.random() * 4,
      });
    }
  
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

      {/* Rain drops */}
      <div className="rain-container">
        {drops.map((drop) => (
          <div
          key={drop.id}
          className="raindrop"
          style={{
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
