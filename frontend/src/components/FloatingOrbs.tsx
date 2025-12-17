import { useEffect, useRef } from "react";
import "./FloatingOrbs.css";

export default function FloatingOrbs() {
  const orbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const orbs = orbsRef.current?.querySelectorAll(".orb");
    if (!orbs) return;

    orbs.forEach((orb, index) => {
      const element = orb as HTMLElement;
      const delay = index * 0.5;
      const duration = 15 + Math.random() * 10;

      element.style.animationDelay = `${delay}s`;
      element.style.animationDuration = `${duration}s`;
    });
  }, []);

  return (
    <div className="floating-orbs" ref={orbsRef}>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      <div className="orb orb-4"></div>
      <div className="orb orb-5"></div>
    </div>
  );
}
