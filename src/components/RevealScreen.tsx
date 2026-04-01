import { motion } from "framer-motion";

interface Props {
  onRestart: () => void;
}

const RevealScreen = ({ onRestart }: Props) => {
  const shareUrl = window.location.href;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "SecureX System Scan", url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <div className="text-6xl md:text-8xl mb-4">😂</div>
        <h1
          className="text-4xl md:text-6xl font-black mb-4 text-foreground glitch-text"
          style={{ fontFamily: "var(--font-display)", textShadow: "var(--neon-glow-strong)" }}
        >
          APRIL FOOL
        </h1>
        <div className="text-6xl md:text-8xl mb-6">😂</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-muted-foreground text-lg mb-2">
          Your device is safe.
        </p>
        <p className="text-muted-foreground/60 text-sm mb-8">
          This was just a prank! No data was collected or stored.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={handleShare} className="neon-btn px-8 py-3 rounded text-sm">
            🔗 Prank a Friend
          </button>
          <button
            onClick={onRestart}
            className="neon-btn px-8 py-3 rounded text-sm opacity-60 hover:opacity-100"
          >
            ↻ Try Again
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RevealScreen;
