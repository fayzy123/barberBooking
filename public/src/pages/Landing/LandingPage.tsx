import { useState } from "react";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";

export default function LandingPage() {
  const [showLoader, setShowLoader] = useState(true);

  return (
    <>
      <Navbar />
      <Hero />
      <div
        style={{
          height: "100vh",
          background: "#0c0c0c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontFamily: "Playfair Display, serif",
            color: "var(--color-gold)",
            fontSize: "24px",
            opacity: 0.3,
          }}
        >
          — About Us scene coming next —
        </p>
      </div>
      {showLoader && (
        <LoadingScreen onComplete={() => setShowLoader(false)} />
      )}
    </>
  );
}
