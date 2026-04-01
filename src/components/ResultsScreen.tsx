import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  name: string;
  onComplete: () => void;
}

const RESULTS = [
  { label: "Device Status", value: "COMPROMISED", danger: true },
  { label: "Data Transfer", value: "In Progress..." },
  { label: "Photos", value: "347 files — Uploaded" },
  { label: "Contacts", value: "892 entries — Uploaded" },
  { label: "Social Media", value: "Synced" },
  { label: "Location History", value: "Extracted" },
];

const ResultsScreen = ({ name, onComplete }: Props) => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount < RESULTS.length) {
      const timeout = setTimeout(() => setVisibleCount((c) => c + 1), 700);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(onComplete, 2000);
      return () => clearTimeout(timeout);
    }
  }, [visibleCount, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
    >
      <div className="max-w-lg w-full">
        <div className="border border-destructive/50 rounded p-6 bg-card/80 backdrop-blur scanline relative overflow-hidden">
          <div className="text-destructive text-xs mb-1 tracking-widest uppercase animate-pulse"
               style={{ fontFamily: "var(--font-display)" }}>
            ⚠ WARNING — SECURITY BREACH
          </div>
          <div className="text-muted-foreground text-xs mb-6">
            Target: {name}
          </div>

          <div className="space-y-3">
            {RESULTS.slice(0, visibleCount).map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between text-sm border-b border-border/30 pb-2"
              >
                <span className="text-muted-foreground">{r.label}</span>
                <span className={r.danger ? "text-destructive font-bold animate-pulse" : "text-foreground"}>
                  {r.value}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsScreen;
