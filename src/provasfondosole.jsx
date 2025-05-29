import React, { useEffect, useRef } from "react";

const SunnyBackground = () => {
  const raysRef = useRef(null);

  useEffect(() => {
    let angle = 0;
    let frameId;

    const animate = () => {
      angle += 0.0025;
      if (raysRef.current) {
        raysRef.current.style.transform = `rotate(${angle}rad)`;
      }
      frameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <>
      <style>{`
        .sunny-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: white;
          overflow: hidden;
          z-index: -1;
        }

        .sun {
          position: absolute;
          top: -20px;
          left: -20px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          z-index: 1;
          background: radial-gradient(ellipse at center, rgb(0, 0, 0) 0%,rgba(255, 0, 0, 0) 60%);
        }

        .rays {
          position: absolute;
          top: 30px; /* centro Y del sole */
          left: 30px; /* centro X del sole */
          width: 0;
          height: 0;
          transform-origin: center;
          pointer-events: none;
        }

        .ray {
          position: absolute;
          width: 2px;
          height: 600px;
          background: black;
          opacity: 0.1;
          filter: blur(1.5px);
          transform-origin: top center;
        }
      `}</style>

      <div className="sunny-container">
        <div className="sun" />
        <div className="rays" ref={raysRef}>
          {Array.from({ length: 24 }).map((_, i) => {
            const angleDeg = (i / 24) * 360;
            return (
              <div
                key={i}
                className="ray"
                style={{
                  transform: `rotate(${angleDeg}deg) translateY(-100px)`,
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SunnyBackground;
