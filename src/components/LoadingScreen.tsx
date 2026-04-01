import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface Stage {
  messages: string[];
  progressStart: number;
  progressEnd: number;
  duration: number; // ms for the whole stage
  glitch?: boolean;
  pause?: boolean;
  warning?: boolean;
}

const STAGES: Stage[] = [
  {
    messages: ["Initializing secure connection..."],
    progressStart: 0,
    progressEnd: 8,
    duration: 2000,
  },
  {
    messages: [
      "Connecting to device...",
      "IP address detected",
      "Establishing encrypted tunnel...",
    ],
    progressStart: 8,
    progressEnd: 22,
    duration: 3000,
  },
  {
    messages: [
      "Bypassing firewall...",
      "Injecting access protocol...",
      "Access granted",
    ],
    progressStart: 22,
    progressEnd: 48,
    duration: 4000,
    glitch: true,
  },
  {
    messages: [
      "Scanning internal storage...",
      "Locating media files...",
      "Analyzing social accounts...",
    ],
    progressStart: 48,
    progressEnd: 72,
    duration: 4000,
  },
  {
    messages: [
      "Uploading photos...",
      "Extracting contacts...",
      "Syncing social media...",
      "Transferring data to server...",
    ],
    progressStart: 72,
    progressEnd: 94,
    duration: 3000,
  },
  {
    messages: ["Finalizing transfer..."],
    progressStart: 94,
    progressEnd: 94,
    duration: 2200,
    pause: true,
  },
  {
    messages: ["⚠ SECURITY BREACH DETECTED"],
    progressStart: 94,
    progressEnd: 100,
    duration: 1200,
    warning: true,
  },
];

interface Props {
  name: string;
  onComplete: () => void;
}

const randomDelay = () => 300 + Math.random() * 900;

const LoadingScreen = ({ name, onComplete }: Props) => {
  const [completedLines, setCompletedLines] = useState<{ text: string; warning?: boolean }[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [progress, setProgress] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [flickerOpacity, setFlickerOpacity] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  // Subtle screen flicker
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setFlickerOpacity(0.92 + Math.random() * 0.05);
        setTimeout(() => setFlickerOpacity(1), 80 + Math.random() * 120);
      }
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [completedLines, currentText]);

  // Uneven progress animation
  useEffect(() => {
    let frame: number;
    let target = 0;

    const tick = () => {
      setProgress((p) => {
        if (p >= target) return target;
        // Uneven: sometimes fast, sometimes crawl
        const step = 0.15 + Math.random() * 0.4;
        return Math.min(p + step, target);
      });
      frame = requestAnimationFrame(tick);
    };

    const updateTarget = (t: number) => {
      target = t;
    };

    frame = requestAnimationFrame(tick);

    // Run stages sequentially
    let cancelled = false;

    const runStages = async () => {
      for (const stage of STAGES) {
        if (cancelled) return;

        if (stage.glitch) {
          setIsGlitching(true);
          setTimeout(() => setIsGlitching(false), 600);
        }

        if (stage.warning) {
          setShowWarning(true);
        }

        if (stage.pause) {
          setIsPaused(true);
        } else {
          setIsPaused(false);
        }

        const msgTime = stage.duration / (stage.messages.length + 0.5);

        for (let mi = 0; mi < stage.messages.length; mi++) {
          if (cancelled) return;
          const msg = stage.messages[mi];

          // Typewriter
          for (let ci = 0; ci <= msg.length; ci++) {
            if (cancelled) return;
            setCurrentText(msg.slice(0, ci));
            await sleep(25 + Math.random() * 35);
          }

          // Progress moves during typing
          const msgProgress =
            stage.progressStart +
            ((stage.progressEnd - stage.progressStart) * (mi + 1)) / stage.messages.length;
          updateTarget(msgProgress);

          // Move completed
          setCompletedLines((prev) => [
            ...prev,
            { text: msg, warning: stage.warning },
          ]);
          setCurrentText("");

          // Random delay between messages
          if (mi < stage.messages.length - 1) {
            await sleep(randomDelay());
          }
        }

        // Inter-stage delay
        if (stage.pause) {
          await sleep(stage.duration);
        } else {
          await sleep(300 + Math.random() * 500);
        }

        // Occasional glitch between stages
        if (!stage.glitch && Math.random() > 0.6) {
          setIsGlitching(true);
          setTimeout(() => setIsGlitching(false), 200);
        }
      }

      updateTarget(100);
      await sleep(1000);
      if (!cancelled && !doneRef.current) {
        doneRef.current = true;
        onComplete();
      }
    };

    runStages();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: flickerOpacity }}
      exit={{ opacity: 0 }}
      className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-4 ${isGlitching ? "glitch-text" : ""}`}
    >
      {/* Fake webcam indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-4 right-4 flex items-center gap-2 bg-card/90 border border-destructive/50 rounded px-3 py-2 backdrop-blur z-50"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive" />
        </span>
        <span
          className="text-destructive text-xs font-bold uppercase tracking-wider"
          style={{ fontFamily: "var(--font-display)" }}
        >
          CAM ACTIVE
        </span>
      </motion.div>

      {/* Red flash overlay on warning */}
      {showWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.15, 0, 0.1, 0] }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 bg-destructive z-40 pointer-events-none"
        />
      )}

      <div className="max-w-lg w-full">
        <div
          className={`border rounded p-6 bg-card/80 backdrop-blur scanline relative overflow-hidden ${
            showWarning ? "border-destructive/70" : "border-border"
          }`}
        >
          <div
            className="text-muted-foreground text-xs mb-4 tracking-widest uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Target: {name}
          </div>

          <div ref={scrollRef} className="space-y-1 mb-6 min-h-[200px] max-h-[280px] overflow-y-auto pr-1">
            {completedLines.map((line, i) => (
              <div
                key={i}
                className={`text-sm ${line.warning ? "text-destructive font-bold animate-pulse" : "text-foreground"}`}
              >
                <span className={line.warning ? "text-destructive" : "text-primary/60"}>
                  {line.warning ? "[!]" : "[✓]"}
                </span>{" "}
                {line.text}
              </div>
            ))}
            {currentText && (
              <div className="text-foreground text-sm cursor-blink">
                <span className="text-primary/60">[&gt;]</span> {currentText}
              </div>
            )}
            {isPaused && !currentText && (
              <div className="text-foreground text-sm animate-pulse cursor-blink">
                <span className="text-primary/60">[&gt;]</span> Finalizing transfer...
              </div>
            )}
          </div>

          <div className="progress-track rounded-sm h-3">
            <div
              className={`h-full rounded-sm transition-all duration-300 ${
                showWarning ? "bg-destructive shadow-[0_0_15px_hsl(0_84%_60%/0.5)]" : "progress-fill"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className={`text-right text-xs mt-1 ${showWarning ? "text-destructive" : "text-muted-foreground"}`}>
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </motion.div>
  );
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default LoadingScreen;
