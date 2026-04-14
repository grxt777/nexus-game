import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const bootSequence = [
    'NEXUS OS v4.1.7 — Lazarus Research Division',
    'Initiating boot sequence...',
    '',
    '> Checking system integrity... WARNING',
    '> Loading user profiles... 1 of 47 found',
    '> Restoring session... PARTIAL',
    '> Network status... ISOLATED',
    '> Last active: 2031-09-03 04:17:22',
    '',
    'Welcome, GUEST_09.',
    'Your session has been restored from backup.',
    'Some data may be missing or corrupted.',
    '',
    'NOTE: You are the only active user on this network.'
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bootSequence.length) {
        setLines(prev => [...prev, bootSequence[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (lines.length === bootSequence.length) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(onComplete, 1000);
            return 100;
          }
          return prev + Math.random() * 10;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [lines.length, onComplete]);

  return (
    <div className="p-12 h-full flex flex-col justify-between bg-bg font-mono">
      <div className="space-y-1.5">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.1 }}
            className={line.includes('WARNING') ? 'text-warning' : 'text-text-main'}
          >
            {line}
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-md space-y-3">
        <div className="flex justify-between text-[10px] uppercase tracking-widest text-text-dim">
          <span>Booting System...</span>
          <span>{Math.floor(progress)}%</span>
        </div>
        <div className="h-1.5 bg-white/5 overflow-hidden rounded-full">
          <motion.div
            className="h-full bg-accent shadow-[0_0_10px_rgba(0,255,102,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
