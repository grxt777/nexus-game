/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import BootScreen from './components/BootScreen';
import Desktop from './components/Desktop';
import { audioEngine } from './AudioEngine';

export default function App() {
  const [isBooted, setIsBooted] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (isBooted) {
      const timer = setTimeout(() => {
        setShowDesktop(true);
        audioEngine.startAmbient();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isBooted]);

  if (!hasInteracted) {
    return (
      <div 
        className="h-screen w-screen flex items-center justify-center bg-black cursor-pointer"
        onClick={() => setHasInteracted(true)}
      >
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[#00ff41] text-sm tracking-[0.5em] uppercase"
        >
          [ CLICK TO INITIATE SESSION ]
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text-main font-sans selection:bg-accent selection:text-black overflow-hidden flex flex-col">
      {showDesktop && (
        <div className="h-8 bg-black border-b border-[#222] flex items-center justify-between px-4 font-mono text-[12px] text-text-dim shrink-0">
          <div>NEXUS OS <span className="text-text-main">v4.1.7</span> — Node_17 Active</div>
          <div>2031-09-03 04:22:11 | GUEST_09</div>
        </div>
      )}
      
      <div className="flex-1 relative overflow-hidden">
        {!showDesktop ? (
          <BootScreen onComplete={() => setIsBooted(true)} />
        ) : (
          <Desktop />
        )}
        
        {/* Scanline effect */}
        <div className="scanline" />
        <div className="glitch-overlay" />
        <div className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>
      
      {/* Flicker effect */}
      <div className="pointer-events-none fixed inset-0 z-50 animate-pulse opacity-[0.02] bg-white" />
    </div>
  );
}
