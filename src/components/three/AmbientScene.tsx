import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, Sparkles } from "@react-three/drei";

export function AmbientScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#07070a"]} />
      <fog attach="fog" args={["#07070a", 6, 18]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[-4, 3, 3]} intensity={2} color="#38bdf8" />
      <pointLight position={[4, -3, 3]} intensity={1.4} color="#2563eb" />
      <Suspense fallback={null}>
        <Stars radius={50} depth={40} count={2000} factor={4} fade speed={0.6} />
        <Sparkles count={120} scale={[14, 8, 6]} size={2.5} speed={0.35} color="#38bdf8" />
      </Suspense>
    </Canvas>
  );
}
