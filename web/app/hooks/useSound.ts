"use client";
import { useCallback, useEffect, useRef } from "react";

const STORAGE_KEY = "panda_sound_muted";

// Synthesize sounds using Web Audio API - no external files needed
function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || (window as any).webkitAudioContext;
  if (!AC) return null;
  return new AC();
}

type SoundName =
  | "click"
  | "eat"
  | "wash"
  | "coin"
  | "levelup"
  | "success"
  | "score"
  | "error"
  | "gameover"
  | "swoosh"
  | "button";

// Each sound is a small synthesizer function
const SOUND_DEFS: Record<SoundName, (ctx: AudioContext) => void> = {
  click: (ctx) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(800, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.1);
  },

  eat: (ctx) => {
    // Nom nom - two quick notes
    [0, 0.12].forEach((delay) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.setValueAtTime(300 + delay * 400, ctx.currentTime + delay);
      o.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + delay + 0.1);
      g.gain.setValueAtTime(0.15, ctx.currentTime + delay);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.1);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + delay);
      o.stop(ctx.currentTime + delay + 0.12);
    });
  },

  wash: (ctx) => {
    // Splash - white noise burst
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 2000;
    src.buffer = buffer;
    g.gain.setValueAtTime(0.2, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    src.connect(f).connect(g).connect(ctx.destination);
    src.start();
  },

  coin: (ctx) => {
    // Ka-ching! Two ascending notes
    [0, 0.08].forEach((delay, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(1200 + i * 400, ctx.currentTime + delay);
      g.gain.setValueAtTime(0.25, ctx.currentTime + delay);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.15);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + delay);
      o.stop(ctx.currentTime + delay + 0.15);
    });
  },

  levelup: (ctx) => {
    // Triumphant ascending arpeggio
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const delay = i * 0.12;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      g.gain.setValueAtTime(0.3, ctx.currentTime + delay);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.3);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + delay);
      o.stop(ctx.currentTime + delay + 0.3);
    });
    // Final chord
    const chord = [1047, 1319, 1568]; // C6, E6, G6
    chord.forEach((freq) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(freq, ctx.currentTime + 0.48);
      g.gain.setValueAtTime(0.2, ctx.currentTime + 0.48);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + 0.48);
      o.stop(ctx.currentTime + 1.2);
    });
  },

  success: (ctx) => {
    // Happy two-note jingle
    [0, 0.15].forEach((delay, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(i === 0 ? 660 : 880, ctx.currentTime + delay);
      g.gain.setValueAtTime(0.25, ctx.currentTime + delay);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + delay);
      o.stop(ctx.currentTime + delay + 0.2);
    });
  },

  score: (ctx) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);
    g.gain.setValueAtTime(0.2, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.12);
  },

  error: (ctx) => {
    // Descending buzz
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(300, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.25);
  },

  gameover: (ctx) => {
    // Sad descending notes
    const notes = [523, 466, 392, 330]; // C5, Bb4, G4, E4
    notes.forEach((freq, i) => {
      const delay = i * 0.2;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      g.gain.setValueAtTime(0.2, ctx.currentTime + delay);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.25);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + delay);
      o.stop(ctx.currentTime + delay + 0.3);
    });
  },

  swoosh: (ctx) => {
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.setValueAtTime(3000, ctx.currentTime);
    f.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.15);
    src.buffer = buffer;
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    src.connect(f).connect(g).connect(ctx.destination);
    src.start();
  },

  button: (ctx) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(600, ctx.currentTime);
    g.gain.setValueAtTime(0.1, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.05);
  },
};

export default function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const mutedRef = useRef(false);

  useEffect(() => {
    try {
      mutedRef.current = localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      // ignore
    }
  }, []);

  const play = useCallback((name: SoundName) => {
    if (mutedRef.current) return;
    try {
      if (!ctxRef.current || ctxRef.current.state === "closed") {
        ctxRef.current = getAudioContext();
      }
      const ctx = ctxRef.current;
      if (!ctx) return;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      SOUND_DEFS[name]?.(ctx);
    } catch {
      // Audio not available
    }
  }, []);

  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current;
    try {
      localStorage.setItem(STORAGE_KEY, String(mutedRef.current));
    } catch {
      // ignore
    }
    return mutedRef.current;
  }, []);

  const isMuted = useCallback(() => mutedRef.current, []);

  return { play, toggleMute, isMuted };
}
