"use client";
import React, { useEffect, useRef, useState } from 'react';

interface DonatorScrollbarProps {
  text: string;
  speed?: number; // Speed of scrolling in pixels per second
}

const DonatorScrollbar: React.FC<DonatorScrollbarProps> = ({ text, speed = 30 }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (textRef.current) {
        setTextWidth(textRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative overflow-hidden whitespace-nowrap w-full h-16">
      <div
        className="absolute top-0 right-0 overflow-hidden"
        style={{
          animation: `scrollText ${textWidth / speed}s linear infinite`,
          transform: `translateX(100%)`, // Start from the right edge
        }}
      >
        <div className="text-amber-500 text-5xl" ref={textRef}>{text}</div>
      </div>
      <style jsx>{`
        @keyframes scrollText {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100vw); // Reappear on the right when completely off screen to the left
          }
        }
      `}</style>
    </div>
  );
};

export default DonatorScrollbar;
