"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, ShieldCheck, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-hidden bg-darkBg text-slate-200">
      <div className="mesh-glow top-[-100px] left-[-50px]"></div>
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-neonGlow">W</div><span className="font-bold tracking-wider text-white">Companion App</span></div>
      </header>
      <main className="max-w-5xl mx-auto px-6 text-center relative z-10 py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">Securely Virtualize Your <br/><span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">WhatsApp Engine Connection</span></h1>
          <p className="text-md text-slate-400 max-w-2xl mx-auto mb-10">Link accounts seamlessly over clean WebSocket interfaces built with production architecture.</p>
          <div className="flex justify-center gap-4">
            <Link href="/connect" className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-xl font-medium shadow-neonGlow hover:brightness-110 transition-all">Get Started <ArrowRight size={16} /></Link>
            <Link href="/dashboard" className="flex items-center gap-2 px-8 py-4 border border-glassBorder bg-white/5 text-white rounded-xl font-medium hover:bg-white/10">Workspace <Terminal size={16} /></Link>
          </div>
        </motion.div>
      </main>
      <footer className="border-t border-glassBorder py-6 text-center text-xs text-slate-500 bg-darkBg/80 backdrop-blur-md">&copy; 2026 Web WhatsApp Companion Engine Suite.</footer>
    </div>
  );
}
