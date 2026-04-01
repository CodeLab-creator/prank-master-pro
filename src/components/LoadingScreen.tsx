import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const STEPS = [
  "Connecting to device...",
  "Bypassing firewall...",
  "Accessing social accounts...",
  "Scanning Instagram data...",
  "Uploading files to secure server...",
];

interface Props {
  name: string;
  onComplete: () => void;
}

const LoadingScreen = ({ name, onComplete }: Props) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [progress, setProgress] = useState(0);

  // Typewriter effect
  useEffect(() => {
    if (currentStep >= STEPS.length) {
      setTimeout(onComplete, 800);
      return;
    }

    const text = STEPS[currentStep];
    let charIndex = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      charIndex++;
      setDisplayedText(text.slice(0, charIndex));
      if (charIndex >= text.length) {
        clearInterval(interval);
        setTimeout(() => setCurrentStep((s) => s + 1), 600);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [currentStep, onComplete]);

  // Progress bar
  useEffect(() => {
    const target = Math.min(((currentStep + 1) / STEPS.length) * 100, 100);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= target) { clearInterval(interval); return target; }
        return p + 0.5;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
    >
      <div className="max-w-lg w-full">
        <div className="border border-border rounded p-6 bg-card/80 backdrop-blur scanline relative overflow-hidden">
          <div className="text-muted-foreground text-xs mb-4 tracking-widest uppercase"
               style={{ fontFamily: "var(--font-display)" }}>
            Target: {name}
          </div>

          <div className="space-y-1 mb-6 min-h-[160px]">
            {STEPS.slice(0, currentStep).map((step, i) => (
              <div key={i} className="text-foreground text-sm">
                <span className="text-primary/60">[✓]</span> {step}
              </div>
            ))}
            {currentStep < STEPS.length && (
              <div className="text-foreground text-sm cursor-blink">
                <span className="text-primary/60">[&gt;]</span> {displayedText}
              </div>
            )}
          </div>

          <div className="progress-track rounded-sm h-3">
            <div
              className="progress-fill h-full rounded-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right text-xs text-muted-foreground mt-1">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
