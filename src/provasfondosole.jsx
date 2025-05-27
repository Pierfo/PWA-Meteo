import React from "react";

const SunnyGrayBackground = () => {
  return (
    <div style={styles.container}>
      <div style={styles.sun} />
      <style>{`
        @keyframes skyAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes sunPulse {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(1); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(120deg, #d3d3d3, #f0f0f0)",
    backgroundSize: "400% 400%",
    animation: "skyAnimation 60s ease infinite",
    zIndex: -1,
    overflow: "hidden",
  },
  sun: {
    position: "absolute",
    top: "15%",
    left: "75%",
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "#ffffff",
    boxShadow: `
      0 0 0 10px rgba(255, 255, 255, 0.2),
      0 0 0 20px rgba(255, 255, 255, 0.15),
      0 0 0 30px rgba(255, 255, 255, 0.1),
      0 0 40px 20px rgba(255, 255, 255, 0.05)
    `,
    animation: "sunPulse 10s linear infinite",
  },
};

export default SunnyGrayBackground;
