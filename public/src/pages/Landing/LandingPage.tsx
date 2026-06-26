import { useState } from "react";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";

export default function LandingPage() {
  const [showLoader, setShowLoader] = useState(true);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#0c0c0c",
        position: "relative",
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          background: "#0c0c0c",
        }}
      />
      {showLoader && <LoadingScreen onComplete={() => setShowLoader(false)} />}
    </div>
  );
}
