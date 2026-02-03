"use client";

import { useState, useEffect } from "react";

interface TutorialProps {
  onComplete: () => void;
}

const steps = [
  {
    emoji: "🐼",
    title: "Welcome!",
    description:
      "Meet your new panda friend! Take care of it by feeding, playing, and keeping it clean.",
  },
  {
    emoji: "🍕",
    title: "Feed Your Panda",
    description:
      "Tap Kitchen to open the food tray. Drag food onto your panda or just tap it!",
  },
  {
    emoji: "🎮",
    title: "Play Minigames",
    description:
      "Tap Play to choose from 5 fun minigames. Earn coins and XP!",
  },
  {
    emoji: "💎",
    title: "IDRX & Leaderboard",
    description:
      "Claim free IDRX tokens from the faucet. Your game scores go onchain to the leaderboard!",
  },
  {
    emoji: "✨",
    title: "Have Fun!",
    description:
      "Explore badges, cosmetics, and social features. Your panda evolves as you level up!",
  },
];

const STORAGE_KEY = "panda_tutorial_done";

export default function Tutorial({ onComplete }: TutorialProps) {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    try {
      const done = localStorage.getItem(STORAGE_KEY);
      if (done) {
        onComplete();
      } else {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, [onComplete]);

  if (!visible) return null;

  const finish = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // storage unavailable
    }
    setVisible(false);
    onComplete();
  };

  const goToStep = (next: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentStep(next);
      setTransitioning(false);
    }, 200);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    } else {
      finish();
    }
  };

  const handleSkip = () => {
    finish();
  };

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "3rem",
          border: "8px solid #1f2937",
          boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
          maxWidth: 400,
          width: "100%",
          padding: "2.5rem 2rem 2rem",
          textAlign: "center",
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "scale(0.95)" : "scale(1)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        {/* Emoji */}
        <div style={{ fontSize: "4rem", lineHeight: 1, marginBottom: "1rem" }}>
          {step.emoji}
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "#1f2937",
            margin: "0 0 0.5rem",
          }}
        >
          {step.title}
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: "1rem",
            lineHeight: 1.5,
            color: "#4b5563",
            margin: "0 0 1.5rem",
          }}
        >
          {step.description}
        </p>

        {/* Step indicator dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === currentStep ? 24 : 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: i === currentStep ? "#1f2937" : "#d1d5db",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
          }}
        >
          {!isLast && (
            <button
              onClick={handleSkip}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "1.5rem",
                border: "4px solid #d1d5db",
                background: "#fff",
                color: "#6b7280",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Skip
            </button>
          )}
          <button
            onClick={handleNext}
            style={{
              padding: "0.75rem 2rem",
              borderRadius: "1.5rem",
              border: "4px solid #1f2937",
              background: "#1f2937",
              color: "#fff",
              fontWeight: 800,
              fontSize: "1rem",
              cursor: "pointer",
              flex: isLast ? undefined : 1,
              minWidth: isLast ? 200 : undefined,
            }}
          >
            {isLast ? "Let's Go!" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
