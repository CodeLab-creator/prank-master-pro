import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  onStart: (name: string) => void;
}

const LandingScreen = ({ onStart }: Props) => {
  const [name, setName] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-md w-full"
      >
        <div className="mb-2 text-muted-foreground text-xs tracking-[0.3em] uppercase">
          [ CLASSIFIED ]
        </div>
        <h1
          className="text-4xl md:text-5xl font-bold mb-2 text-foreground"
          style={{ fontFamily: "var(--font-display)", textShadow: "var(--neon-glow-strong)" }}
        >
          H_k
        </h1>
        <h2
          className="text-lg md:text-xl mb-8 text-foreground tracking-widest uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          SecureX System Scan
        </h2>

        <div className="border border-border rounded p-6 bg-card/80 backdrop-blur scanline relative overflow-hidden">
          <p className="text-muted-foreground text-sm mb-4">
            &gt; Initialize target identification...
          </p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="neon-input w-full px-4 py-3 rounded mb-4 text-center"
            onKeyDown={(e) => e.key === "Enter" && name.trim() && onStart(name.trim())}
          />
          <button
            onClick={() => name.trim() && onStart(name.trim())}
            disabled={!name.trim()}
            className="neon-btn w-full py-3 rounded text-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ▶ Start Scan
          </button>
        </div>

        <p className="text-muted-foreground/50 text-xs mt-6">
          v3.7.1 // SecureX Corp // Authorized Personnel Only
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LandingScreen;
