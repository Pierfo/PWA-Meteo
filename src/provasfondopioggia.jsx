// RainBackground.tsx
import React from "react";

const RainBackground = () => {
  const drops = Array.from({ length: 100 }, (_, i) => i);

  return (
    <div style={{ position: "fixed", width: "100%", height: "100%", overflow: "hidden", zIndex: -1 }}>
      {drops.map((drop) => (
        <div
          key={drop}
          style={{
            position: "absolute",
            // top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: "7px",
            height: "19px",
            borderRadius: "3px",
            background: "rgba(174,194,224,0.5)",
            animation: `fall ${2 + Math.random() * 2}s linear infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </div>
  );
};

export default RainBackground;
