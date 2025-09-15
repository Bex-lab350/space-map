import { useState, useRef, useEffect } from "react";
import background from "./Rote.png";
import "./App.css";
import { db } from "./firebase";
import { ref, onValue, set } from "firebase/database";

function App() {
  const originalWidth = 1152;
  const originalHeight = 768;

  const planets = [
    { id: 1, x: 450, y: 235, size: 70 },
    { id: 2, x: 724, y: 74, size: 70 },
    { id: 3, x: 609, y: 135, size: 70 },
    { id: 4, x: 672, y: 227, size: 70 },
    { id: 5, x: 544, y: 311, size: 70 },
    { id: 6, x: 606, y: 397, size: 70 },
    { id: 7, x: 566, y: 503, size: 70 },
    { id: 8, x: 942, y: 153, size: 70 },
    { id: 9, x: 952, y: 264, size: 70 },
    { id: 10, x: 950, y: 400, size: 70 },
    { id: 11, x: 885, y: 481, size: 70 },
    { id: 12, x: 726, y: 481, size: 63 },
    { id: 13, x: 678, y: 561, size: 63 },
    { id: 14, x: 729, y: 346, size: 70 },
    { id: 15, x: 450, y: 565, size: 65 },
    { id: 16, x: 400, y: 481, size: 65 },
    { id: 17, x: 261, y: 496, size: 70 },
    { id: 18, x: 192, y: 405, size: 70 },
    { id: 19, x: 175, y: 266, size: 70 },
    { id: 20, x: 197, y: 162, size: 70 },
  ];

  const [planetToggles, setPlanetToggles] = useState({});
  const [activePlanet, setActivePlanet] = useState(null);
  const [imgSize, setImgSize] = useState({ width: originalWidth, height: originalHeight });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");

  const imgRef = useRef(null);

  // Load planet data from Firebase
  useEffect(() => {
    const togglesRef = ref(db, "planetToggles");
    onValue(togglesRef, (snapshot) => {
      const data = snapshot.val() || {};
      setPlanetToggles(data);
    });
  }, []);

  // Resize handling
  useEffect(() => {
    if (imgRef.current) {
      const updateSize = () => {
        setImgSize({
          width: imgRef.current.clientWidth,
          height: imgRef.current.clientHeight,
        });
      };
      updateSize();
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }
  }, []);

  const handleToggle = (planetId, index) => {
    if (!isLoggedIn) return; // 🚫 block non-logged users
    const oldToggles = planetToggles[planetId] ? [...planetToggles[planetId]] : Array(6).fill(false);
    oldToggles[index] = !oldToggles[index];
    const updated = { ...planetToggles, [planetId]: oldToggles };
    setPlanetToggles(updated);
    set(ref(db, "planetToggles"), updated); // ✅ Save to Firebase
  };

  const handleLogin = () => {
    if (password === "GalacticLegendBex0912") {
      setIsLoggedIn(true);
      setShowLogin(false);
      setPassword("");
    } else {
      alert("Wrong password!");
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* White Login Button */}
      <button
        onClick={() => setShowLogin(true)}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "white",
          color: "black",
          border: "none",
          padding: "6px 12px",
          borderRadius: "6px",
          cursor: "pointer",
          zIndex: 5,
        }}
      >
        Login
      </button>

      {/* Login Popup */}
      {showLogin && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(30,30,30,0.95)",
            padding: "20px",
            borderRadius: "8px",
            color: "white",
            zIndex: 10,
          }}
        >
          <h3>Enter Password</h3>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "8px", width: "200px", marginBottom: "10px" }}
          />
          <br />
          <button
            onClick={handleLogin}
            style={{
              padding: "6px 12px",
              background: "limegreen",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </div>
      )}

      <div style={{ position: "relative" }}>
        <img
          ref={imgRef}
          src={background}
          alt="Space Map"
          style={{
            height: "100vh",
            width: "auto",
            objectFit: "contain",
            display: "block",
          }}
        />

        {planets.map((planet) => {
          const toggles = planetToggles[planet.id] || Array(6).fill(false);
          const activeCount = toggles.filter(Boolean).length;

          const scaleX = imgSize.width / originalWidth;
          const scaleY = imgSize.height / originalHeight;

          const px = planet.x * scaleX;
          const py = planet.y * scaleY;
          const ps = planet.size * ((scaleX + scaleY) / 2);

          return (
            <div key={planet.id}>
              {/* Invisible hitbox */}
              <div
                style={{
                  position: "absolute",
                  top: `${py}px`,
                  left: `${px}px`,
                  width: `${ps}px`,
                  height: `${ps}px`,
                  cursor: "pointer",
                  borderRadius: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                }}
                onClick={() =>
                  setActivePlanet(activePlanet === planet.id ? null : planet.id)
                }
              />

              {/* ✅ Green segmented ring */}
              <div
                style={{
                  position: "absolute",
                  top: `${py}px`,
                  left: `${px}px`,
                  width: `${ps * 1.4}px`,
                  height: `${ps * 1.4}px`,
                  borderRadius: "50%",
                  background: `conic-gradient(rgba(0,255,0,0.6) ${
                    activeCount * 16.66
                  }%, transparent ${activeCount * 16.66}% 100%)`,
                  WebkitMask: "radial-gradient(circle, transparent 65%, black 70%)",
                  mask: "radial-gradient(circle, transparent 65%, black 70%)",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              />

              {/* Toggle menu */}
              {activePlanet === planet.id && (
                <div
                  style={{
                    position: "absolute",
                    top: `${py + ps / 2 + 10}px`,
                    left: `${px + ps / 2 + 10}px`,
                    background: "rgba(20,20,20,0.95)",
                    color: "white",
                    padding: "8px",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    transform: "translate(-50%, 0)",
                    zIndex: 3,
                  }}
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <label
                      key={i}
                      style={{
                        color: toggles[i] ? "limegreen" : "white",
                        cursor: isLoggedIn ? "pointer" : "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={toggles[i] || false}
                        disabled={!isLoggedIn}
                        onChange={() => handleToggle(planet.id, i)}
                        style={{
                          width: "16px",
                          height: "16px",
                          accentColor: "limegreen",
                        }}
                      />
                      Pluton {i + 1}
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;