"use client";

import { useAnimationFrame } from "motion/react";
import { useRef } from "react";

export default function EmtyChart() {
  const ref = useRef<HTMLDivElement>(null);

  useAnimationFrame((time) => {
    if (!ref.current) return;
    const rotateX = Math.sin(time / 1000) * 180;
    const rotateY = Math.cos(time / 1000) * 180;
    ref.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  return (
    <div className="emty-container">
      <div className="emty-cube" ref={ref}>
        {["front", "back", "left", "right", "top", "bottom"].map((side) => (
          <div key={side} className={`emty-side emty-${side}`}>
            <div className="emty-image">
              <img src="/assets/logo.webp" alt="NEUSS-HMI" />
            </div>
          </div>
        ))}
      </div>
      <EmtyCubeStyles />
    </div>
  );
}

function EmtyCubeStyles() {
  return (
    <style>{`
      .emty-container {
        perspective: 1000px;
        width: 6rem;
        height: 6rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .emty-cube {
        width: 6rem;
        height: 6rem;
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.1s ease-in-out;
      }

      .emty-side {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0.2;
      }

      .emty-front  { transform: rotateY(  0deg) translateZ(3rem); background-color: rgb(30, 82, 57); }
      .emty-back   { transform: rotateY(180deg) translateZ(3rem); background-color: rgb(30, 82, 57); }
      .emty-left   { transform: rotateY(-90deg) translateZ(3rem); background-color: rgb(195, 239, 217); }
      .emty-right  { transform: rotateY( 90deg) translateZ(3rem); background-color: rgb(195, 239, 217); }
      .emty-top    { transform: rotateX( 90deg) translateZ(3rem); background-color: rgb(30, 82, 57); }
      .emty-bottom { transform: rotateX(-90deg) translateZ(3rem); background-color: rgb(195, 239, 217); }

      .emty-image {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 70%;
        height: 70%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .emty-image img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    `}</style>
  );
}
