import React, { useEffect, useState } from "react";

const SnowBackground = ({ wind = 0 }) => {
  const [flakes, setFlakes] = useState([]);
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
    const density = 0.07; // meno densa della pioggia
    const numFlakes = Math.floor(width * density);

    const newFlakes = [];

    for (let i = 0; i < numFlakes; i++) {
      newFlakes.push({
        id: i,
        left: -wind + Math.random() * (100 + wind),
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 5, // più lento
        size: 2 + Math.random() * 4,
      });
    }

    setFlakes(newFlakes);
  }, [size]);

  return (
    <>
      <style>{`
        .snow-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
          z-index: -1;
        }

        .snowflake {
          position: absolute;
          top: -5%;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 50%;
          animation-name: snowfall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes snowfall {
          0% {
            transform: translateY(0) translateX(0);
          }
          100% {
            transform: translate(${wind}px, 120vh);
          }
        }
      `}</style>

      <div className="snow-container">
        {flakes.map((flake) => (
          <div
            key={flake.id}
            className="snowflake"
            style={{
              left: `${flake.left}%`,
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              animationDelay: `${flake.delay}s`,
              animationDuration: `${flake.duration}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default SnowBackground;
