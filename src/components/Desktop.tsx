import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, Search, Folder, FileText, Settings, Lock, Activity } from 'lucide-react';
import Terminal from './Terminal';
import NexusSearch from './NexusSearch';

export default function Desktop() {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);

  const toggleWindow = (id: string) => {
    if (openWindows.includes(id)) {
      setOpenWindows(prev => prev.filter(w => w !== id));
      if (activeWindow === id) setActiveWindow(null);
    } else {
      setOpenWindows(prev => [...prev, id]);
      setActiveWindow(id);
    }
  };

  const icons = [
    { id: 'home', label: '/home/guest_09/', icon: Folder },
    { id: 'logs', label: '/logs/', icon: Folder },
    { id: 'network', label: '/network/', icon: Folder },
    { id: 'search', label: 'NEXUS SEARCH', icon: Search, color: 'text-blue-400' },
    { id: 'terminal', label: 'TERMINAL', icon: TerminalIcon, color: 'text-[#00ff41]' },
    { id: 'readme', label: 'README_FIRST.txt', icon: FileText },
    { id: 'monitor', label: 'SYSTEM MONITOR', icon: Activity, locked: true },
    { id: 'admin', label: '/admin/', icon: Lock, locked: true },
  ];

  return (
    <div className="relative h-full w-full p-8 overflow-hidden bg-[radial-gradient(circle_at_50%_50%,#111_0%,#050505_100%)]">
      {/* Desktop Icons Grid */}
      <div className="flex flex-col gap-6 w-20">
        {icons.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => !item.locked && toggleWindow(item.id)}
            className={`flex flex-col items-center gap-1.5 p-2 rounded border border-transparent transition-colors ${item.locked ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="w-12 h-12 border-[1.5px] border-[#333] bg-white/5 rounded flex items-center justify-center relative">
              <item.icon className={`w-6 h-6 ${item.color || 'text-text-dim'}`} />
              {item.locked && <Lock className="absolute -top-1 -right-1 w-3 h-3 text-error" />}
            </div>
            <span className="text-[10px] font-mono text-center leading-tight uppercase tracking-[0.5px]">
              {item.id}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Floating Search Bar (Theme specific) */}
      <div className="absolute top-8 right-8 w-72 h-10 bg-black border border-[#444] flex items-center px-3 font-mono text-[11px]">
        <span className="text-text-dim mr-2">🔍</span> NEXUS_SEARCH:// <span className="text-white ml-1">kwald_profile</span>
      </div>

      {/* Windows Layer */}
      <AnimatePresence>
        {openWindows.includes('terminal') && (
          <Window
            id="terminal"
            title="TERMINAL - guest_09@nexus-7"
            onClose={() => toggleWindow('terminal')}
            isActive={activeWindow === 'terminal'}
            onFocus={() => setActiveWindow('terminal')}
          >
            <Terminal />
          </Window>
        )}
        {openWindows.includes('search') && (
          <Window
            id="search"
            title="NEXUS SEARCH - Lazarus Intranet"
            onClose={() => toggleWindow('search')}
            isActive={activeWindow === 'search'}
            onFocus={() => setActiveWindow('search')}
          >
            <NexusSearch />
          </Window>
        )}
      </AnimatePresence>

      {/* Background N17 Presence */}
      <div className="absolute bottom-4 right-4 text-[10px] opacity-20 pointer-events-none">
        NEXUS-7 KERNEL v4.1.7 | UPTIME: 00:00:42 | NODE_17: ACTIVE
      </div>
    </div>
  );
}

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  isActive: boolean;
  onFocus: () => void;
}

function Window({ title, children, onClose, isActive, onFocus }: WindowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      onClick={onFocus}
      className={`absolute inset-x-20 inset-y-10 flex flex-col border border-[#333] bg-panel rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden ${isActive ? 'z-40' : 'z-30 opacity-80'}`}
    >
      {/* Title Bar */}
      <div className={`h-9 flex items-center justify-between px-3 border-b border-[#333] ${isActive ? 'bg-[#1F2025]' : 'bg-[#16171B]'}`}>
        <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-text-main">{title}</span>
        <div className="flex items-center gap-2">
          <div className="flex gap-2 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#333]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#333]" />
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="w-2.5 h-2.5 rounded-full bg-error hover:brightness-125 transition-all" 
            />
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-auto relative">
        {children}
      </div>
    </motion.div>
  );
}
