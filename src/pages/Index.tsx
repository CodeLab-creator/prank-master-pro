import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import MatrixRain from "@/components/MatrixRain";
import LandingScreen from "@/components/LandingScreen";
import LoadingScreen from "@/components/LoadingScreen";
import ResultsScreen from "@/components/ResultsScreen";
import RevealScreen from "@/components/RevealScreen";

type Screen = "landing" | "loading" | "results" | "reveal";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("landing");
  const [name, setName] = useState("");

  const handleStart = (n: string) => {
    setName(n);
    setScreen("loading");
  };

  const handleRestart = () => {
    setName("");
    setScreen("landing");
  };

  return (
    <div className="relative min-h-screen overflow-hidden scanline">
      <MatrixRain />
      <AnimatePresence mode="wait">
        {screen === "landing" && <LandingScreen key="land" onStart={handleStart} />}
        {screen === "loading" && (
          <LoadingScreen key="load" name={name} onComplete={useCallback(() => setScreen("results"), [])} />
        )}
        {screen === "results" && (
          <ResultsScreen key="res" name={name} onComplete={useCallback(() => setScreen("reveal"), [])} />
        )}
        {screen === "reveal" && <RevealScreen key="rev" onRestart={handleRestart} />}
      </AnimatePresence>
    </div>
  );
};

export default Index;
