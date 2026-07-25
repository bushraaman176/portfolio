import { FlipBook } from "./FlipBook";
import { AmbientScene } from "@/components/three/AmbientScene";
import { motion } from "framer-motion";

export function BookExperience() {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      {/* Ambient 3D background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <AmbientScene />
      </div>

      {/* Fade-from-black intro */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.6, delay: 0.2 }}
        className="pointer-events-none absolute inset-0 z-50 bg-black"
      />

      <div className="relative z-10 min-h-dvh w-full">
        <FlipBook />
      </div>
    </div>
  );
}
